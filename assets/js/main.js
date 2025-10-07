// 经典云网盘 - 主JavaScript文件

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 初始化导航
    initNavigation();
    
    // 初始化模态框
    initModals();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 检查URL参数
    checkUrlParams();
}

// 导航功能
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // 导航链接点击处理
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // 更新活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // 移动端关闭菜单
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', updateNavOnScroll);
}

// 滚动时更新导航
function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// 模态框功能
function initModals() {
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// 显示登录模态框
function showLogin() {
    closeAllModals();
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        // 聚焦到用户名输入框
        setTimeout(() => {
            const usernameInput = document.getElementById('username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }, 100);
    }
}

// 显示注册模态框
function showRegister() {
    closeAllModals();
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
        // 聚焦到用户名输入框
        setTimeout(() => {
            const usernameInput = document.getElementById('reg_username');
            if (usernameInput) {
                usernameInput.focus();
            }
        }, 100);
    }
}

// 关闭指定模态框
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// 关闭所有模态框
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// 平滑滚动
function initSmoothScroll() {
    // 已在导航点击处理中实现
}

// 检查URL参数
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 检查分享参数
    if (urlParams.get('share')) {
        showToast('检测到分享链接，请登录后查看', 'info');
        setTimeout(() => {
            showLogin();
        }, 2000);
    }
    
    // 检查其他参数
    if (urlParams.get('action') === 'register') {
        showRegister();
    } else if (urlParams.get('action') === 'login') {
        showLogin();
    }
}

// Toast通知功能
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // 设置消息和类型
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 表单验证
function validateLoginForm(formData) {
    const username = formData.get('username');
    const password = formData.get('password');
    
    if (!username || username.length < 3) {
        showToast('用户名至少需要3个字符', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        showToast('密码至少需要6个字符', 'error');
        return false;
    }
    
    return true;
}

function validateRegisterForm(formData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    
    if (!username || username.length < 3) {
        showToast('用户名至少需要3个字符', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showToast('请输入有效的邮箱地址', 'error');
        return false;
    }
    
    if (!password || password.length < 6) {
        showToast('密码至少需要6个字符', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return false;
    }
    
    return true;
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 模拟API调用
function simulateApiCall(endpoint, data) {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            if (endpoint === 'login') {
                // 模拟登录响应
                if (data.username === 'demo' && data.password === 'demo123') {
                    resolve({
                        success: true,
                        message: '登录成功',
                        token: 'demo_token_' + Date.now(),
                        user: {
                            id: 1,
                            username: 'demo',
                            email: 'demo@example.com'
                        }
                    });
                } else {
                    reject({
                        success: false,
                        message: '用户名或密码错误'
                    });
                }
            } else if (endpoint === 'register') {
                // 模拟注册响应
                resolve({
                    success: true,
                    message: '注册成功，请登录'
                });
            } else {
                reject({
                    success: false,
                    message: '服务暂时不可用'
                });
            }
        }, 1000);
    });
}

// 处理登录
async function handleLogin(formData) {
    try {
        showToast('正在登录...', 'info');
        const response = await simulateApiCall('login', {
            username: formData.get('username'),
            password: formData.get('password')
        });
        
        if (response.success) {
            showToast(response.message, 'success');
            // 存储用户信息
            localStorage.setItem('user_token', response.token);
            localStorage.setItem('user_info', JSON.stringify(response.user));
            
            // 关闭模态框
            closeModal('loginModal');
            
            // 重定向到仪表板（这里只是演示）
            setTimeout(() => {
                showToast('演示版本：实际部署时将跳转到用户仪表板', 'info');
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || '登录失败', 'error');
    }
}

// 处理注册
async function handleRegister(formData) {
    try {
        showToast('正在注册...', 'info');
        const response = await simulateApiCall('register', {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        
        if (response.success) {
            showToast(response.message, 'success');
            closeModal('registerModal');
            
            // 显示登录框
            setTimeout(() => {
                showLogin();
            }, 1000);
        }
    } catch (error) {
        showToast(error.message || '注册失败', 'error');
    }
}

// 检查用户登录状态
function checkUserLogin() {
    const token = localStorage.getItem('user_token');
    const userInfo = localStorage.getItem('user_info');
    
    if (token && userInfo) {
        try {
            const user = JSON.parse(userInfo);
            return {
                isLoggedIn: true,
                user: user,
                token: token
            };
        } catch (e) {
            // 清除无效数据
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_info');
        }
    }
    
    return {
        isLoggedIn: false,
        user: null,
        token: null
    };
}

// 用户登出
function logout() {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_info');
    showToast('已退出登录', 'success');
    
    // 刷新页面或重定向
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// 页面加载动画
function showLoadingAnimation() {
    // 可以添加页面加载动画
}

// 隐藏加载动画
function hideLoadingAnimation() {
    // 隐藏加载动画
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：格式化日期
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('zh-CN', options);
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 导出函数供全局使用
window.CloudDisk = {
    showLogin,
    showRegister,
    closeModal,
    showToast,
    checkUserLogin,
    logout,
    formatFileSize,
    formatDate
};