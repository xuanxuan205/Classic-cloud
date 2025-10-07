// 经典云网盘系统 - 分享功能JavaScript

let shareModal = null;
let currentFileId = null;

document.addEventListener('DOMContentLoaded', function() {
    initShareModal();
});

// 初始化分享模态框
function initShareModal() {
    shareModal = document.getElementById('share-modal');
    if (!shareModal) {
        createShareModal();
    }
}

// 创建分享模态框
function createShareModal() {
    const modalHtml = `
        <div id="share-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="share-modal-title">创建分享链接</h3>
                    <button type="button" class="modal-close" onclick="closeShareModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="share-modal-body">
                    <!-- 分享内容将在这里动态加载 -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    shareModal = document.getElementById('share-modal');
    
    // 点击模态框外部关闭
    shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });
}

// 分享文件
function shareFile(fileId) {
    currentFileId = fileId;
    
    const modalTitle = document.getElementById('share-modal-title');
    const modalBody = document.getElementById('share-modal-body');
    
    modalTitle.textContent = '创建分享链接';
    modalBody.innerHTML = createShareForm();
    
    shareModal.classList.add('active');
}

// 创建分享表单
function createShareForm() {
    return `
        <form id="share-form" class="share-form">
            <div class="form-group">
                <label for="share-password">访问密码（可选）</label>
                <input type="text" id="share-password" name="password" class="form-control" 
                       placeholder="留空表示无需密码" maxlength="20">
                <small class="form-text">设置访问密码可以保护您的文件安全</small>
            </div>
            
            <div class="form-group">
                <label for="download-limit">下载次数限制</label>
                <select id="download-limit" name="download_limit" class="form-control">
                    <option value="0">不限制</option>
                    <option value="1">1次</option>
                    <option value="5">5次</option>
                    <option value="10">10次</option>
                    <option value="50">50次</option>
                    <option value="100">100次</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="expire-days">有效期</label>
                <select id="expire-days" name="expire_days" class="form-control">
                    <option value="0">永久有效</option>
                    <option value="1">1天</option>
                    <option value="7" selected>7天</option>
                    <option value="30">30天</option>
                    <option value="90">90天</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeShareModal()">取消</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-share-alt"></i>
                    创建分享
                </button>
            </div>
        </form>
    `;
}

// 处理分享表单提交
document.addEventListener('submit', function(e) {
    if (e.target.id === 'share-form') {
        e.preventDefault();
        createShareLink();
    }
});

// 创建分享链接
function createShareLink() {
    const form = document.getElementById('share-form');
    const formData = new FormData(form);
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'create');
    formData.append('file_id', currentFileId);
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 创建中...';
    submitBtn.disabled = true;
    
    fetch('api/shares.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showShareResult(data.data);
        } else {
            showToast(data.message, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('创建分享链接失败:', error);
        showToast('创建分享链接失败，请重试', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// 显示分享结果
function showShareResult(shareData) {
    const modalTitle = document.getElementById('share-modal-title');
    const modalBody = document.getElementById('share-modal-body');
    
    modalTitle.textContent = '分享链接创建成功';
    modalBody.innerHTML = createShareResult(shareData);
    
    // 刷新分享列表
    if (currentSection === 'shares') {
        loadShareList();
    }
}

// 创建分享结果内容
function createShareResult(shareData) {
    return `
        <div class="share-result">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h4>分享链接创建成功！</h4>
            
            <div class="share-info">
                <div class="info-item">
                    <label>分享链接：</label>
                    <div class="share-url-container">
                        <input type="text" id="share-url" class="form-control" 
                               value="${shareData.share_url}" readonly>
                        <button type="button" class="btn btn-outline-primary" onclick="copyShareUrl()">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                
                ${shareData.password ? `
                <div class="info-item">
                    <label>访问密码：</label>
                    <div class="password-container">
                        <span class="password-text">${shareData.password}</span>
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="copyPassword('${shareData.password}')">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                ` : ''}
                
                <div class="info-item">
                    <label>下载限制：</label>
                    <span>${shareData.download_limit > 0 ? shareData.download_limit + '次' : '不限制'}</span>
                </div>
                
                <div class="info-item">
                    <label>有效期：</label>
                    <span>${shareData.expire_time ? formatTime(shareData.expire_time) : '永久有效'}</span>
                </div>
            </div>
            
            <div class="share-actions">
                <button type="button" class="btn btn-primary" onclick="copyShareInfo()">
                    <i class="fas fa-copy"></i>
                    复制分享信息
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeShareModal()">
                    完成
                </button>
            </div>
        </div>
    `;
}

// 复制分享链接
function copyShareUrl() {
    const shareUrl = document.getElementById('share-url');
    shareUrl.select();
    document.execCommand('copy');
    showToast('分享链接已复制到剪贴板', 'success');
}

// 复制密码
function copyPassword(password) {
    navigator.clipboard.writeText(password).then(() => {
        showToast('访问密码已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = password;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('访问密码已复制到剪贴板', 'success');
    });
}

// 复制分享信息
function copyShareInfo() {
    const shareUrl = document.getElementById('share-url').value;
    const passwordElement = document.querySelector('.password-text');
    const password = passwordElement ? passwordElement.textContent : '';
    
    let shareText = `📁 文件分享\n🔗 链接: ${shareUrl}`;
    if (password) {
        shareText += `\n🔑 密码: ${password}`;
    }
    shareText += `\n\n来自经典云网盘`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('分享信息已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('分享信息已复制到剪贴板', 'success');
    });
}

// 关闭分享模态框
function closeShareModal() {
    if (shareModal) {
        shareModal.classList.remove('active');
    }
}

// 加载分享列表
function loadShareList(page = 1) {
    const shareList = document.getElementById('share-list');
    shareList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><span>加载中...</span></div>';
    
    fetch(`api/shares.php?action=list&page=${page}&limit=20`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.shares.length > 0) {
                displayShareList(data.data.shares, 'share-list');
                updatePagination(data.data, 'share-pagination', loadShareList);
            } else {
                shareList.innerHTML = '<div class="empty-state"><i class="fas fa-share-alt"></i><h3>暂无分享</h3><p>您还没有创建任何分享链接</p></div>';
            }
        })
        .catch(error => {
            console.error('加载分享列表失败:', error);
            shareList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><h3>加载失败</h3><p>请刷新页面重试</p></div>';
        });
}

// 显示分享列表
function displayShareList(shares, containerId) {
    const container = document.getElementById(containerId);
    
    let html = '';
    shares.forEach(share => {
        const statusClass = share.is_expired ? 'expired' : share.is_limit_reached ? 'limit-reached' : 'active';
        const statusText = share.is_expired ? '已过期' : share.is_limit_reached ? '已达限制' : '正常';
        
        html += `
            <div class="share-item ${statusClass}" data-share-id="${share.id}">
                <div class="share-file-info">
                    <div class="file-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-details">
                        <div class="file-name">${escapeHtml(share.original_name)}</div>
                        <div class="file-meta">
                            <span>${formatFileSize(share.file_size)}</span>
                            <span>创建于 ${formatTime(share.created_at)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="share-stats">
                    <div class="stat-item">
                        <span class="stat-number">${share.download_count}</span>
                        <span class="stat-label">下载</span>
                    </div>
                    ${share.download_limit > 0 ? `
                    <div class="stat-item">
                        <span class="stat-number">${share.download_limit}</span>
                        <span class="stat-label">限制</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="share-status">
                    <span class="status-badge status-${statusClass}">${statusText}</span>
                    ${share.has_password ? '<i class="fas fa-lock" title="有密码保护"></i>' : ''}
                </div>
                
                <div class="share-actions">
                    <button class="action-btn copy" onclick="copyShareLink('${share.share_code}')" title="复制链接">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn edit" onclick="editShare(${share.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteShare(${share.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 复制分享链接
function copyShareLink(shareCode) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const shareUrl = `${protocol}//${host}/share.php?code=${shareCode}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('分享链接已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('分享链接已复制到剪贴板', 'success');
    });
}

// 编辑分享
function editShare(shareId) {
    // 获取分享信息
    fetch(`api/shares.php?action=info&share_id=${shareId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showEditShareModal(shareId, data.data);
            } else {
                showToast(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('获取分享信息失败:', error);
            showToast('获取分享信息失败', 'error');
        });
}

// 显示编辑分享模态框
function showEditShareModal(shareId, shareData) {
    const modalTitle = document.getElementById('share-modal-title');
    const modalBody = document.getElementById('share-modal-body');
    
    modalTitle.textContent = '编辑分享设置';
    modalBody.innerHTML = createEditShareForm(shareId, shareData);
    
    shareModal.classList.add('active');
}

// 创建编辑分享表单
function createEditShareForm(shareId, shareData) {
    return `
        <form id="edit-share-form" class="share-form">
            <input type="hidden" name="share_id" value="${shareId}">
            
            <div class="form-group">
                <label for="edit-share-password">访问密码</label>
                <input type="text" id="edit-share-password" name="password" class="form-control" 
                       placeholder="留空表示无需密码" maxlength="20">
                <small class="form-text">修改或清空访问密码</small>
            </div>
            
            <div class="form-group">
                <label for="edit-download-limit">下载次数限制</label>
                <select id="edit-download-limit" name="download_limit" class="form-control">
                    <option value="0" ${shareData.download_limit == 0 ? 'selected' : ''}>不限制</option>
                    <option value="1" ${shareData.download_limit == 1 ? 'selected' : ''}>1次</option>
                    <option value="5" ${shareData.download_limit == 5 ? 'selected' : ''}>5次</option>
                    <option value="10" ${shareData.download_limit == 10 ? 'selected' : ''}>10次</option>
                    <option value="50" ${shareData.download_limit == 50 ? 'selected' : ''}>50次</option>
                    <option value="100" ${shareData.download_limit == 100 ? 'selected' : ''}>100次</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="edit-expire-days">有效期</label>
                <select id="edit-expire-days" name="expire_days" class="form-control">
                    <option value="0">永久有效</option>
                    <option value="1">1天</option>
                    <option value="7">7天</option>
                    <option value="30">30天</option>
                    <option value="90">90天</option>
                </select>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeShareModal()">取消</button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    保存修改
                </button>
            </div>
        </form>
    `;
}

// 处理编辑分享表单提交
document.addEventListener('submit', function(e) {
    if (e.target.id === 'edit-share-form') {
        e.preventDefault();
        updateShare();
    }
});

// 更新分享设置
function updateShare() {
    const form = document.getElementById('edit-share-form');
    const formData = new FormData(form);
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'update');
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
    submitBtn.disabled = true;
    
    fetch('api/shares.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            closeShareModal();
            loadShareList();
        } else {
            showToast(data.message, 'error');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    })
    .catch(error => {
        console.error('更新分享设置失败:', error);
        showToast('更新分享设置失败，请重试', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// 删除分享
function deleteShare(shareId) {
    if (!confirm('确定要删除这个分享链接吗？')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'delete');
    formData.append('share_id', shareId);
    
    fetch('api/shares.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            loadShareList();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('删除分享失败:', error);
        showToast('删除分享失败，请重试', 'error');
    });
}

// 批量删除分享
function batchDeleteShares() {
    const selectedShares = Array.from(document.querySelectorAll('.share-item input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.closest('.share-item').dataset.shareId);
    
    if (selectedShares.length === 0) {
        showToast('请先选择要删除的分享', 'warning');
        return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedShares.length} 个分享链接吗？`)) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'batch_delete');
    formData.append('share_ids', JSON.stringify(selectedShares));
    
    fetch('api/shares.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            loadShareList();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('批量删除分享失败:', error);
        showToast('批量删除分享失败，请重试', 'error');
    });
}