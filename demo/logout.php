<?php
// 演示版本登出
session_start();

// 清除演示会话
unset($_SESSION['demo_user']);
unset($_SESSION['demo_user_data']);
session_destroy();

// 重定向到登录页
header('Location: index.php');
exit;
?>