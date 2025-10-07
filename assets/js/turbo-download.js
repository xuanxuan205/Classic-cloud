/**
 * 高速下载客户端
 * 支持分块并行下载，大幅提升下载速度
 */

class TurboDownloader {
    constructor(options = {}) {
        this.maxChunks = options.maxChunks || 8; // 最大并行块数
        this.chunkSize = options.chunkSize || 1024 * 1024; // 1MB per chunk
        this.retryCount = options.retryCount || 3;
        this.timeout = options.timeout || 30000; // 30秒超时
        
        this.onProgress = options.onProgress || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
        
        this.chunks = [];
        this.completedChunks = 0;
        this.totalSize = 0;
        this.downloadedSize = 0;
    }
    
    /**
     * 开始高速下载
     * @param {string} url - 下载URL
     * @param {string} filename - 文件名
     */
    async download(url, filename) {
        try {
            // 1. 获取文件信息
            const fileInfo = await this.getFileInfo(url);
            this.totalSize = fileInfo.size;
            
            // 2. 计算分块策略
            const chunks = this.calculateChunks(fileInfo.size);
            this.chunks = chunks; // 保存块信息
            
            // 3. 显示下载开始
            this.showDownloadProgress(filename);
            
            // 4. 检查是否支持分块下载
            if (chunks.length === 1 || !fileInfo.supportsRange) {
                console.log('使用单块下载模式');
                // 单块下载
                const chunkData = await this.downloadChunk(url, chunks[0], 0);
                const blob = new Blob([chunkData.data], { type: 'application/octet-stream' });
                this.saveFile(blob, filename);
            } else {
                console.log(`使用 ${chunks.length} 块并行下载模式`);
                
                // 4. 并行下载所有块
                const chunkPromises = chunks.map((chunk, index) => 
                    this.downloadChunk(url, chunk, index)
                );
                
                // 5. 等待所有块下载完成
                const chunkData = await Promise.all(chunkPromises);
                
                // 6. 合并文件块
                const blob = this.mergeChunks(chunkData);
                
                // 7. 触发下载
                this.saveFile(blob, filename);
            }
            
            this.onComplete();
            this.hideDownloadProgress();
            
        } catch (error) {
            this.onError(error);
            this.hideDownloadProgress();
            console.error('下载失败:', error);
        }
    }
    
    /**
     * 获取文件信息
     */
    async getFileInfo(url) {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
            throw new Error('无法获取文件信息');
        }
        
        const size = parseInt(response.headers.get('content-length') || '0');
        const supportsRange = response.headers.get('accept-ranges') === 'bytes';
        
        return { size, supportsRange };
    }
    
    /**
     * 计算分块策略
     */
    calculateChunks(fileSize) {
        // 小文件直接下载
        if (fileSize < this.chunkSize * 2) {
            return [{ start: 0, end: fileSize - 1 }];
        }
        
        // 计算最优块数
        const optimalChunks = Math.min(
            this.maxChunks,
            Math.ceil(fileSize / this.chunkSize)
        );
        
        const chunks = [];
        const chunkSize = Math.ceil(fileSize / optimalChunks);
        
        for (let i = 0; i < optimalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize - 1, fileSize - 1);
            chunks.push({ start, end, size: end - start + 1 });
        }
        
        return chunks;
    }
    
    /**
     * 下载单个块
     */
    async downloadChunk(url, chunk, index) {
        const chunkUrl = `${url}&turbo=true&chunk=${index}&chunks=${this.chunks.length}`;
        
        for (let retry = 0; retry < this.retryCount; retry++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                
                const response = await fetch(chunkUrl, {
                    headers: {
                        'Range': `bytes=${chunk.start}-${chunk.end}`
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                // 验证响应大小
                const contentLength = parseInt(response.headers.get('content-length') || '0');
                const expectedSize = chunk.end - chunk.start + 1;
                
                if (contentLength > 0 && contentLength !== expectedSize) {
                    console.warn(`块 ${index} 大小不匹配: 期望 ${expectedSize}, 实际 ${contentLength}`);
                }
                
                const arrayBuffer = await response.arrayBuffer();
                
                // 验证下载的数据大小
                if (arrayBuffer.byteLength !== expectedSize) {
                    throw new Error(`块 ${index} 数据大小错误: 期望 ${expectedSize}, 实际 ${arrayBuffer.byteLength}`);
                }
                
                // 更新进度
                this.downloadedSize += arrayBuffer.byteLength;
                this.completedChunks++;
                
                const progress = (this.downloadedSize / this.totalSize) * 100;
                this.onProgress(progress, this.downloadedSize, this.totalSize);
                this.updateProgressBar(progress);
                
                return { 
                    index, 
                    data: arrayBuffer, 
                    start: chunk.start, 
                    end: chunk.end,
                    size: arrayBuffer.byteLength
                };
                
            } catch (error) {
                console.error(`块 ${index} 下载失败 (尝试 ${retry + 1}/${this.retryCount}):`, error);
                
                if (retry === this.retryCount - 1) {
                    throw new Error(`块 ${index} 下载失败: ${error.message}`);
                }
                
                // 等待后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
            }
        }
    }
    
    /**
     * 合并文件块
     */
    mergeChunks(chunkData) {
        // 按索引排序
        chunkData.sort((a, b) => a.index - b.index);
        
        // 验证块的连续性
        let expectedStart = 0;
        for (let i = 0; i < chunkData.length; i++) {
            const chunk = chunkData[i];
            if (chunk.start !== expectedStart) {
                throw new Error(`块 ${i} 起始位置错误: 期望 ${expectedStart}, 实际 ${chunk.start}`);
            }
            expectedStart = chunk.end + 1;
        }
        
        // 验证总大小
        const totalSize = chunkData.reduce((sum, chunk) => sum + chunk.data.byteLength, 0);
        if (totalSize !== this.totalSize) {
            throw new Error(`文件大小不匹配: 期望 ${this.totalSize}, 实际 ${totalSize}`);
        }
        
        // 合并数据
        const mergedArray = new Uint8Array(totalSize);
        let offset = 0;
        
        for (const chunk of chunkData) {
            const chunkArray = new Uint8Array(chunk.data);
            mergedArray.set(chunkArray, offset);
            offset += chunkArray.byteLength;
            
            console.log(`合并块 ${chunk.index}: ${chunk.start}-${chunk.end} (${chunkArray.byteLength} 字节)`);
        }
        
        console.log(`文件合并完成: ${totalSize} 字节`);
        return new Blob([mergedArray], { type: 'application/octet-stream' });
    }
    
    /**
     * 保存文件
     */
    saveFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 清理URL对象
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    
    /**
     * 显示下载进度
     */
    showDownloadProgress(filename) {
        // 创建进度弹窗
        const modal = document.createElement('div');
        modal.id = 'turbo-download-modal';
        modal.innerHTML = `
            <div class="turbo-download-overlay">
                <div class="turbo-download-dialog">
                    <div class="turbo-download-header">
                        <h3>🚀 高速下载中</h3>
                        <div class="turbo-download-filename">${filename}</div>
                    </div>
                    <div class="turbo-download-body">
                        <div class="turbo-progress-container">
                            <div class="turbo-progress-bar">
                                <div class="turbo-progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="turbo-progress-text">0%</div>
                        </div>
                        <div class="turbo-download-stats">
                            <div class="turbo-stat">
                                <span class="turbo-stat-label">已下载:</span>
                                <span class="turbo-stat-value" id="downloaded-size">0 B</span>
                            </div>
                            <div class="turbo-stat">
                                <span class="turbo-stat-label">总大小:</span>
                                <span class="turbo-stat-value" id="total-size">0 B</span>
                            </div>
                            <div class="turbo-stat">
                                <span class="turbo-stat-label">并行块数:</span>
                                <span class="turbo-stat-value">${this.maxChunks}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .turbo-download-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .turbo-download-dialog {
                background: white;
                border-radius: 12px;
                padding: 24px;
                min-width: 400px;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .turbo-download-header h3 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 18px;
            }
            
            .turbo-download-filename {
                color: #666;
                font-size: 14px;
                word-break: break-all;
                margin-bottom: 20px;
            }
            
            .turbo-progress-container {
                margin-bottom: 20px;
            }
            
            .turbo-progress-bar {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .turbo-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            
            .turbo-progress-text {
                text-align: center;
                font-weight: 600;
                color: #333;
            }
            
            .turbo-download-stats {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 16px;
            }
            
            .turbo-stat {
                text-align: center;
            }
            
            .turbo-stat-label {
                display: block;
                font-size: 12px;
                color: #666;
                margin-bottom: 4px;
            }
            
            .turbo-stat-value {
                display: block;
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // 更新总大小显示
        document.getElementById('total-size').textContent = this.formatBytes(this.totalSize);
    }
    
    /**
     * 更新进度条
     */
    updateProgressBar(progress) {
        const modal = document.getElementById('turbo-download-modal');
        if (!modal) return;
        
        const progressFill = modal.querySelector('.turbo-progress-fill');
        const progressText = modal.querySelector('.turbo-progress-text');
        const downloadedSize = modal.querySelector('#downloaded-size');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        if (downloadedSize) {
            downloadedSize.textContent = this.formatBytes(this.downloadedSize);
        }
    }
    
    /**
     * 隐藏下载进度
     */
    hideDownloadProgress() {
        const modal = document.getElementById('turbo-download-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    /**
     * 格式化字节大小
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// 全局函数：启动高速下载
window.turboDownload = function(fileId, filename, shareCode = '') {
    let url = `api/turbo_download.php?id=${fileId}`;
    if (shareCode) {
        url = `api/turbo_download.php?code=${shareCode}`;
    }
    
    const downloader = new TurboDownloader({
        maxChunks: 8,
        onProgress: (progress, downloaded, total) => {
            console.log(`下载进度: ${progress.toFixed(1)}%`);
        },
        onComplete: () => {
            console.log('下载完成！');
            // 可以添加成功提示
        },
        onError: (error) => {
            console.error('下载失败:', error);
            alert('下载失败: ' + error.message);
        }
    });
    
    downloader.download(url, filename);
};

// 导出类供其他模块使用
window.TurboDownloader = TurboDownloader;