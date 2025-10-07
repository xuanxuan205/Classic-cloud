// 经典云网盘系统 - 认证页面JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAuthPage();
});

function initAuthPage() {
    // 密码强度检测
    const passwordInput = document.querySelector('input[name="password"]');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // 密码确认检测
    const confirmInput = document.querySelector('input[name="password_confirm"]');
    if (confirmInput) {
        confirmInput.addEventListener('input', checkPasswordMatch);
    }
    
    // 验证码刷新
    const captchaImage = document.querySelector('.captcha-image');
    if (captchaImage) {
        captchaImage.addEventListener('click', refreshCaptcha);
    }
    
    // 表单提交处理
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // 自动聚焦第一个输入框
    const firstInput = document.querySelector('input[type="text"], input[type="email"]');
    if (firstInput) {
        firstInput.focus();
    }
}

function checkPasswordStrength(e) {
    const password = e.target.value;
    let strengthIndicator = document.getElementById('password-strength');
    
    if (!strengthIndicator) {
        strengthIndicator = document.createElement('div');
        strengthIndicator.id = 'password-strength';
        strengthIndicator.className = 'password-strength';
        e.target.parentNode.appendChild(strengthIndicator);
    }
    
    if (password.length === 0) {
        strengthIndicator.style.display = 'none';
        return;
    }
    
    strengthIndicator.style.display = 'block';
    
    const strength = calculatePasswordStrength(password);
    
    strengthIndicator.className = `password-strength strength-${strength.level}`;
    strengthIndicator.innerHTML = `
        <div class="strength-bar">
            <div class="strength-fill" style="width: ${strength.score}%"></div>
        </div>
        <div class="strength-text">密码强度: ${strength.text}</div>
    `;
}

function calculatePasswordStrength(password) {
    let score = 0;
    let level = 'weak';
    let text = '弱';
    
    // 长度检查
    if (password.length >= 6) score += 20;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    
    // 字符类型检查
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    // 确定强度等级
    if (score >= 80) {
        level = 'strong';
        text = '强';
    } else if (score >= 60) {
        level = 'medium';
        text = '中';
    }
    
    return { score: Math.min(score, 100), level, text };
}

function checkPasswordMatch(e) {
    const password = document.querySelector('input[name="password"]').value;
    const confirm = e.target.value;
    let matchIndicator = document.getElementById('password-match');
    
    if (!matchIndicator) {
        matchIndicator = document.createElement('div');
        matchIndicator.id = 'password-match';
        matchIndicator.className = 'password-match';
        e.target.parentNode.appendChild(matchIndicator);
    }
    
    if (confirm === '') {
        matchIndicator.style.display = 'none';
        return;
    }
    
    matchIndicator.style.display = 'block';
    
    if (password === confirm) {
        matchIndicator.className = 'password-match match-success';
        matchIndicator.innerHTML = '<i class="fas fa-check"></i> 密码匹配';
    } else {
        matchIndicator.className = 'password-match match-error';
        matchIndicator.innerHTML = '<i class="fas fa-times"></i> 密码不匹配';
    }
}

function refreshCaptcha() {
    const captchaImage = document.querySelector('.captcha-image');
    if (captchaImage) {
        captchaImage.src = 'index.php?page=captcha&t=' + Date.now();
    }
}

function handleLoginSubmit(e) {
    const form = e.target;
    const username = form.querySelector('input[name="username"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;
    const captcha = form.querySelector('input[name="captcha"]').value.trim();
    
    // 基本验证
    if (!username || !password || !captcha) {
        showAlert('请填写完整的登录信息', 'error');
        e.preventDefault();
        return false;
    }
    
    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    showLoadingButton(submitBtn, '登录中...');
}

function handleRegisterSubmit(e) {
    const form = e.target;
    const username = form.querySelector('input[name="username"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();
    const password = form.querySelector('input[name="password"]').value;
    const passwordConfirm = form.querySelector('input[name="password_confirm"]').value;
    const captcha = form.querySelector('input[name="captcha"]').value.trim();
    const agreeTerms = form.querySelector('input[name="agree_terms"]').checked;
    
    // 基本验证
    if (!username || !email || !password || !captcha) {
        showAlert('请填写完整的注册信息', 'error');
        e.preventDefault();
        return false;
    }
    
    // 用户名验证
    if (username.length < 3 || username.length > 20) {
        showAlert('用户名长度必须在3-20个字符之间', 'error');
        e.preventDefault();
        return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showAlert('用户名只能包含字母、数字和下划线', 'error');
        e.preventDefault();
        return false;
    }
    
    // 邮箱验证
    if (!isValidEmail(email)) {
        showAlert('请输入有效的邮箱地址', 'error');
        e.preventDefault();
        return false;
    }
    
    // 密码验证
    if (password.length < 6) {
        showAlert('密码长度不能少于6位', 'error');
        e.preventDefault();
        return false;
    }
    
    if (password !== passwordConfirm) {
        showAlert('两次输入的密码不一致', 'error');
        e.preventDefault();
        return false;
    }
    
    // 服务条款验证
    if (!agreeTerms) {
        showAlert('请阅读并同意服务条款', 'error');
        e.preventDefault();
        return false;
    }
    
    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    showLoadingButton(submitBtn, '注册中...');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoadingButton(button, text) {
    if (button) {
        button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        button.disabled = true;
        
        // 10秒后恢复按钮状态（防止网络问题导致按钮永久禁用）
        setTimeout(() => {
            if (button.disabled) {
                button.disabled = false;
                // 恢复原始文本
                if (text.includes('登录')) {
                    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> 登录';
                } else if (text.includes('注册')) {
                    button.innerHTML = '<i class="fas fa-user-plus"></i> 注册账户';
                }
            }
        }, 10000);
    }
}

function showAlert(message, type = 'info') {
    // 移除现有的提示
    const existingAlert = document.querySelector('.alert-dynamic');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 创建新的提示
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dynamic`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // 插入到表单前面
    const form = document.querySelector('.auth-form');
    if (form) {
        const h2 = form.querySelector('h2');
        if (h2) {
            h2.insertAdjacentElement('afterend', alert);
        } else {
            form.insertBefore(alert, form.firstChild);
        }
    }
    
    // 自动消失
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.opacity = '0';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 添加动态样式
const style = document.createElement('style');
style.textContent = `
.alert-dynamic {
    animation: slideDown 0.3s ease;
    position: relative;
}

.alert-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.7;
    color: inherit;
}

.alert-close:hover {
    opacity: 1;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fa-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

document.head.appendChild(style);