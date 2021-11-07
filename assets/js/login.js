window.addEventListener('load', function() {
    let login_box = document.querySelector('.login-box');
    let register_box = document.querySelector('.register-box');
    let link_login = document.querySelector('#link-login');
    let link_reg = document.querySelector('#link-reg');
    // 切换注册和登录
    link_login.addEventListener('click', function() {
        login_box.style.display = 'none';
        register_box.style.display = 'block';
    })
    link_reg.addEventListener('click', function() {
        login_box.style.display = 'block';
        register_box.style.display = 'none';
    })
})