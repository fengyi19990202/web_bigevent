window.addEventListener('load', function() {
    let login_box = document.querySelector('.login-box');
    let register_box = document.querySelector('.register-box');
    let link_login = document.querySelector('#link-login');
    let link_reg = document.querySelector('#link-reg');
    // 根路径
    const loginUrl = 'http://www.liulongbin.top:3007';
    // 切换注册表单和登录表单
    link_login.addEventListener('click', function() {
        login_box.style.display = 'none';
        register_box.style.display = 'block';
    });
    link_reg.addEventListener('click', function() {
        login_box.style.display = 'block';
        register_box.style.display = 'none';
    });
    // 获取layui的form对象
    let layForm = layui.form;
    layForm.verify({
        // 用户名验证规则
        username: [/^[a-zA-Z0-9]{6,16}$/, '用户名格式不对'],
        // 密码验证规则
        password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 再次验证密码,形参是用户输入的value值
        repassword: function(iptVal) {
            let val = document.querySelector('#confirmPassword').value;
            if (val !== iptVal) {
                return '输入的密码不一致';
            }
        }
    });
    // 提交注册信息
    let layer = layui.layer;
    let form_login = document.querySelector('#form-login');
    let xhr = new XMLHttpRequest();
    form_login.addEventListener('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 获取用户填写的账户和密码
        let username = document.querySelector('#regName');
        let repassword = document.querySelector('#confirmPassword');
        xhr.open('POST', loginUrl + '/api/reguser');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`username=${username.value}&password=${repassword.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // 不等于0表示注册失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg(text.message);
                }
                layer.msg('注册成功，请登录');
                link_reg.click();
            }
        }
    });
    // 提交登录信息
    let login_form = document.querySelector('#login-form');
    let loginUsername = document.querySelector('#loginUsername');
    let loginPassword = document.querySelector('#loginPassword');
    // 监听表单提交事件
    login_form.addEventListener('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 将用户信息提交服务器
        xhr.open('POST', loginUrl + '/api/login');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(`username=${loginUsername.value}&password=${loginPassword.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功');
                // 登录成功存储token到本地存储
                localStorage.setItem('token', text.token);
                // 300毫秒后跳转到后台主页
                setTimeout(function() {
                    location.href = './index.html';
                }, 300)
            }
        }
    })
})