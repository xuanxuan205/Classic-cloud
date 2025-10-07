// 经典云网盘系统 - 文件操作JavaScript

let selectedFiles = new Set();
let selectedFolders = new Set();
let currentFolderId = 0;
let isSelectionMode = false;

// 文件夹操作函数
function createFolder() {
    const name = prompt('请输入文件夹名称:');
    if (!name || !name.trim()) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'create');
    formData.append('name', name.trim());
    formData.append('parent_id', currentFolderId);
    
    fetch('api/folders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('创建文件夹失败:', error);
        showToast('创建文件夹失败，请重试', 'error');
    });
}

function renameFolder(folderId) {
    const folderElement = document.querySelector(`[data-folder-id="${folderId}"]`);
    const currentName = folderElement.querySelector('.folder-name').textContent;
    
    const newName = prompt('请输入新的文件夹名称:', currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'rename');
    formData.append('folder_id', folderId);
    formData.append('new_name', newName.trim());
    
    fetch('api/folders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('重命名文件夹失败:', error);
        showToast('重命名文件夹失败，请重试', 'error');
    });
}

function deleteFolder(folderId) {
    if (!confirm('确定要删除这个文件夹吗？文件夹及其内容将被移到回收站。')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'delete');
    formData.append('folder_id', folderId);
    
    fetch('api/folders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('删除文件夹失败:', error);
        showToast('删除文件夹失败，请重试', 'error');
    });
}

function restoreFolder(folderId) {
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'restore');
    formData.append('folder_id', folderId);
    
    fetch('api/folders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('恢复文件夹失败:', error);
        showToast('恢复文件夹失败，请重试', 'error');
    });
}

function permanentDeleteFolder(folderId) {
    if (!confirm('确定要永久删除这个文件夹吗？此操作无法撤销！')) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'permanent_delete');
    formData.append('folder_id', folderId);
    
    fetch('api/folders.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
            loadDashboardStats();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('永久删除文件夹失败:', error);
        showToast('永久删除文件夹失败，请重试', 'error');
    });
}

// 文件操作函数
function renameFile(fileId) {
    const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    const currentName = fileElement.querySelector('.file-name').textContent;
    
    const newName = prompt('请输入新的文件名称:', currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) {
        return;
    }
    
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'rename');
    formData.append('file_id', fileId);
    formData.append('new_name', newName.trim());
    
    fetch('api/files.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('重命名文件失败:', error);
        showToast('重命名文件失败，请重试', 'error');
    });
}

function moveFile(fileId, targetFolderId) {
    const formData = new FormData();
    formData.append('csrf_token', document.getElementById('csrf-token').value);
    formData.append('action', 'move');
    formData.append('file_id', fileId);
    formData.append('target_folder_id', targetFolderId);
    
    fetch('api/files.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast(data.message, 'success');
            refreshCurrentView();
        } else {
            showToast(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('移动文件失败:', error);
        showToast('移动文件失败，请重试', 'error');
    });
}

// 批量操作函数
function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    const button = document.getElementById('selection-mode-btn');
    const batchActions = document.getElementById('batch-actions');
    
    if (isSelectionMode) {
        button.textContent = '取消选择';
        button.classList.add('active');
        batchActions.style.display = 'flex';
        
        // 添加选择框
        addSelectionCheckboxes();
    } else {
        button.textContent = '批量操作';
        button.classList.remove('active');
        batchActions.style.display = 'none';
        
        // 移除选择框
        removeSelectionCheckboxes();
        clearSelection();
    }
}

function addSelectionCheckboxes() {
    // 为文件添加选择框
    document.querySelectorAll('.file-item').forEach(item => {
        if (!item.querySelector('.selection-checkbox')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'selection-checkbox';
            checkbox.addEventListener('change', function() {
                const fileId = item.dataset.fileId;
                if (this.checked) {
                    selectedFiles.add(fileId);
                } else {
                    selectedFiles.delete(fileId);
                }
                updateBatchActionButtons();
            });
            
            item.insertBefore(checkbox, item.firstChild);
        }
    });
    
    // 为文件夹添加选择框
    document.querySelectorAll('.folder-item').forEach(item => {
        if (!item.querySelector('.selection-checkbox')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'selection-checkbox';
            checkbox.addEventListener('change', function() {
                const folderId = item.dataset.folderId;
                if (this.checked) {
                    selectedFolders.add(folderId);
                } else {
                    selectedFolders.delete(folderId);
                }
                updateBatchActionButtons();
            });
            
            item.insertBefore(checkbox, item.firstChild);
        }
    });
}

function removeSelectionCheckboxes() {
    document.querySelectorAll('.selection-checkbox').forEach(checkbox => {
        checkbox.remove();
    });
}

function clearSelection() {
    selectedFiles.clear();
    selectedFolders.clear();
    updateBatchActionButtons();
}

function selectAll() {
    document.querySelectorAll('.selection-checkbox').forEach(checkbox => {
        checkbox.checked = true;
        
        const item = checkbox.parentElement;
        if (item.dataset.fileId) {
            selectedFiles.add(item.dataset.fileId);
        } else if (item.dataset.folderId) {
            selectedFolders.add(item.dataset.folderId);
        }
    });
    
    updateBatchActionButtons();
}

function updateBatchActionButtons() {
    const hasSelection = selectedFiles.size > 0 || selectedFolders.size > 0;
    const batchButtons = document.querySelectorAll('.batch-action-btn');
    
    batchButtons.forEach(button => {
        button.disabled = !hasSelection;
    });
    
    // 更新选择计数
    const selectionCount = document.getElementById('selection-count');
    if (selectionCount) {
        selectionCount.textContent = `已选择 ${selectedFiles.size + selectedFolders.size} 项`;
    }
}

function batchDelete() {
    if (selectedFiles.size === 0 && selectedFolders.size === 0) {
        showToast('请先选择要删除的项目', 'warning');
        return;
    }
    
    if (!confirm(`确定要删除选中的 ${selectedFiles.size + selectedFolders.size} 个项目吗？`)) {
        return;
    }
    
    const promises = [];
    
    // 删除选中的文件
    selectedFiles.forEach(fileId => {
        const formData = new FormData();
        formData.append('csrf_token', document.getElementById('csrf-token').value);
        formData.append('action', 'delete');
        formData.append('file_id', fileId);
        
        promises.push(fetch('api/files.php', {
            method: 'POST',
            body: formData
        }));
    });
    
    // 删除选中的文件夹
    selectedFolders.forEach(folderId => {
        const formData = new FormData();
        formData.append('csrf_token', document.getElementById('csrf-token').value);
        formData.append('action', 'delete');
        formData.append('folder_id', folderId);
        
        promises.push(fetch('api/folders.php', {
            method: 'POST',
            body: formData
        }));
    });
    
    Promise.all(promises)
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(results => {
            const successCount = results.filter(r => r.success).length;
            const totalCount = results.length;
            
            if (successCount === totalCount) {
                showToast(`成功删除 ${successCount} 个项目`, 'success');
            } else {
                showToast(`删除了 ${successCount}/${totalCount} 个项目`, 'warning');
            }
            
            clearSelection();
            refreshCurrentView();
            loadDashboardStats();
        })
        .catch(error => {
            console.error('批量删除失败:', error);
            showToast('批量删除失败，请重试', 'error');
        });
}

function batchMove() {
    if (selectedFiles.size === 0 && selectedFolders.size === 0) {
        showToast('请先选择要移动的项目', 'warning');
        return;
    }
    
    // 显示文件夹选择对话框
    showFolderSelector((targetFolderId) => {
        const promises = [];
        
        // 移动选中的文件
        selectedFiles.forEach(fileId => {
            const formData = new FormData();
            formData.append('csrf_token', document.getElementById('csrf-token').value);
            formData.append('action', 'move');
            formData.append('file_id', fileId);
            formData.append('target_folder_id', targetFolderId);
            
            promises.push(fetch('api/files.php', {
                method: 'POST',
                body: formData
            }));
        });
        
        // 移动选中的文件夹
        selectedFolders.forEach(folderId => {
            const formData = new FormData();
            formData.append('csrf_token', document.getElementById('csrf-token').value);
            formData.append('action', 'move');
            formData.append('folder_id', folderId);
            formData.append('target_parent_id', targetFolderId);
            
            promises.push(fetch('api/folders.php', {
                method: 'POST',
                body: formData
            }));
        });
        
        Promise.all(promises)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(results => {
                const successCount = results.filter(r => r.success).length;
                const totalCount = results.length;
                
                if (successCount === totalCount) {
                    showToast(`成功移动 ${successCount} 个项目`, 'success');
                } else {
                    showToast(`移动了 ${successCount}/${totalCount} 个项目`, 'warning');
                }
                
                clearSelection();
                refreshCurrentView();
            })
            .catch(error => {
                console.error('批量移动失败:', error);
                showToast('批量移动失败，请重试', 'error');
            });
    });
}

// 文件夹选择器
function showFolderSelector(callback) {
    fetch('api/folders.php?action=list&parent_id=0')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const modalContent = createFolderSelectorContent(data.data, callback);
                openModal('选择目标文件夹', modalContent);
            } else {
                showToast('加载文件夹列表失败', 'error');
            }
        })
        .catch(error => {
            console.error('加载文件夹列表失败:', error);
            showToast('加载文件夹列表失败', 'error');
        });
}

function createFolderSelectorContent(folders, callback) {
    let html = `
        <div class="folder-selector">
            <div class="folder-item" data-folder-id="0" onclick="selectTargetFolder(0, '根目录', ${callback})">
                <i class="fas fa-home"></i>
                <span>根目录</span>
            </div>
    `;
    
    folders.forEach(folder => {
        html += `
            <div class="folder-item" data-folder-id="${folder.id}" onclick="selectTargetFolder(${folder.id}, '${escapeHtml(folder.name)}', ${callback})">
                <i class="fas fa-folder"></i>
                <span>${escapeHtml(folder.name)}</span>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function selectTargetFolder(folderId, folderName, callback) {
    if (confirm(`确定要移动到"${folderName}"吗？`)) {
        callback(folderId);
        closeModal();
    }
}

// 文件预览
function previewFile(fileId) {
    fetch(`api/files.php?action=info&file_id=${fileId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const file = data.data;
                const previewContent = createPreviewContent(file);
                openModal(`预览 - ${file.original_name}`, previewContent);
            } else {
                showToast('获取文件信息失败', 'error');
            }
        })
        .catch(error => {
            console.error('获取文件信息失败:', error);
            showToast('获取文件信息失败', 'error');
        });
}

function createPreviewContent(file) {
    const fileType = file.file_type.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const textTypes = ['txt', 'md', 'json', 'xml', 'csv'];
    
    let content = `
        <div class="file-preview">
            <div class="file-info">
                <h4>${escapeHtml(file.original_name)}</h4>
                <p>大小: ${formatFileSize(file.file_size)}</p>
                <p>类型: ${file.file_type.toUpperCase()}</p>
                <p>上传时间: ${formatTime(file.created_at)}</p>
                <p>下载次数: ${file.download_count}</p>
            </div>
            <div class="preview-content">
    `;
    
    if (imageTypes.includes(fileType)) {
        content += `<img src="api/download.php?id=${file.id}&preview=1" alt="${escapeHtml(file.original_name)}" style="max-width: 100%; height: auto;">`;
    } else if (textTypes.includes(fileType) && file.file_size < 1024 * 1024) { // 小于1MB的文本文件
        content += `<div class="text-preview">正在加载预览...</div>`;
        // 这里可以通过AJAX加载文本内容
    } else {
        content += `
            <div class="no-preview">
                <i class="fas fa-file fa-3x"></i>
                <p>此文件类型不支持预览</p>
                <button class="btn btn-primary" onclick="downloadFile(${file.id})">
                    <i class="fas fa-download"></i> 下载文件
                </button>
            </div>
        `;
    }
    
    content += `
            </div>
        </div>
    `;
    
    return content;
}

// 刷新当前视图
function refreshCurrentView() {
    switch (currentSection) {
        case 'files':
            loadFileList(currentPage);
            break;
        case 'trash':
            loadTrashList(currentPage);
            break;
        case 'shares':
            loadShareList();
            break;
        default:
            loadDashboardStats();
            break;
    }
}

// 导航到文件夹
function navigateToFolder(folderId) {
    currentFolderId = folderId;
    loadFileList(1, folderId);
    updateBreadcrumb(folderId);
}

// 更新面包屑导航
function updateBreadcrumb(folderId) {
    fetch(`api/folders.php?action=path&folder_id=${folderId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const breadcrumb = document.getElementById('breadcrumb');
                if (breadcrumb) {
                    let html = '';
                    data.data.forEach((folder, index) => {
                        if (index > 0) {
                            html += ' <i class="fas fa-chevron-right"></i> ';
                        }
                        
                        if (index === data.data.length - 1) {
                            html += `<span class="current">${escapeHtml(folder.name)}</span>`;
                        } else {
                            html += `<a href="#" onclick="navigateToFolder(${folder.id})">${escapeHtml(folder.name)}</a>`;
                        }
                    });
                    
                    breadcrumb.innerHTML = html;
                }
            }
        })
        .catch(error => {
            console.error('更新面包屑导航失败:', error);
        });
}