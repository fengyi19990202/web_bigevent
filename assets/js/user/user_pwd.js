window.addEventListener('load', function() {
    // 项目根路径
    const loginUrl = 'http://api-breakingnews-web.itheima.net';
    // 验证密码
    let form = layui.form;
    form.verify({
        // 密码验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码验证规则
        samePwd: function(val) {
            let oldpwd = document.querySelector('[name=oldpwd]');
            if (oldpwd.value === val) {
                return '新旧密码不能相同'
            }
        },
        // 旧密码验证规则
        rePwd: function(val) {
            let newpwd = document.querySelector('[name=newpwd]');
            if (newpwd.value !== val) {
                return '两次密码不一致'
            }
        }
    });
    // 重置密码
    let form_pwd = document.querySelector('#form_pwd');
    form_pwd.addEventListener('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 有无token
        let token = localStorage.getItem('token') || '';
        // 发起修改的请求
        let newPwd = document.querySelector('#newPwd');
        let oldPwd = document.querySelector('#oldPwd');
        let xhr = new XMLHttpRequest();
        xhr.open('POST', loginUrl + '/my/updatepwd');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', token);
        xhr.send(`oldPwd=${oldPwd.value}&newPwd=${newPwd.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('更改密码失败');
                }
                layer.msg('更新成功');
                // 重置表单
                form_pwd.reset()
            }
        }
    })
})