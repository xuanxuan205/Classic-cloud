// 存储空间显示脚本
function updateStorageDisplay() {
    // 查找存储空间显示元素
    const storageElements = document.querySelectorAll(".storage-info, [data-storage], .storage-stats");
    
    storageElements.forEach(element => {
        if (element.textContent.includes("加载中")) {
            element.innerHTML = "正在获取存储信息...";
            
            fetch("/api/storage_stats.php")
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const stats = data.data;
                        element.innerHTML = `
                            <div style="padding: 10px; background: #f8f9fa; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>已使用: ${stats.formatted.used}</span>
                                    <span>可用: ${stats.formatted.free}</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${stats.used_percentage}%; height: 100%; background: linear-gradient(90deg, #28a745, #ffc107, #dc3545); transition: width 0.3s;"></div>
                                </div>
                                <div style="text-align: center; margin-top: 5px; font-size: 0.9em; color: #666;">
                                    ${stats.used_percentage}% 已使用 (${stats.formatted.total} 总容量)
                                </div>
                            </div>
                        `;
                    } else {
                        element.innerHTML = "存储信息获取失败";
                    }
                })
                .catch(error => {
                    console.error("Storage error:", error);
                    element.innerHTML = "存储信息加载失败";
                });
        }
    });
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function() {
    updateStorageDisplay();
    
    // 每30秒更新一次
    setInterval(updateStorageDisplay, 30000);
});