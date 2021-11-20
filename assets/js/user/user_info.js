window.addEventListener('load', function() {
    let form = layui.form;
    let layer = layui.layer;
    // 项目根路径
    const loginUrl = 'http://www.liulongbin.top:3007';
    // 添加表单验证
    form.verify({
        // 昵称小于6位数
        nickname: function(value) {
            if (value.length > 6) {
                return '您的昵称要小于6位';
            }
        }
    });
    getUser();
    // 获取用户的信息
    function getUser() {
        // 判断是否有储存token
        let token = localStorage.getItem('token') || '';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', loginUrl + '/my/userinfo');
        xhr.setRequestHeader('Authorization', token);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // status为0表示获取成功
                if (JSON.parse(xhr.responseText).status === 0) {
                    let user = JSON.parse(xhr.responseText).data;
                    if (JSON.parse(xhr.responseText).status === 0) {
                        // 利用layui快速给表单赋值
                        form.val("formUserInfo", user);
                    } else {
                        return layer.msg('获取信息失败');
                    }
                }
            }
        }
    };
    // 重置按钮的操作
    let btnReset = document.querySelector('#btnReset');
    btnReset.addEventListener('click', function(e) {
        // 阻止默认重置行为
        e.preventDefault();
        // 将信息重置
        getUser();
    });
    // 更新用户信息
    let form_info = document.querySelector('#form_info');
    form_info.addEventListener('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        // 发起更新用户信息的Ajax请求
        let user_id = document.querySelector('#user_id');
        let nickName = document.querySelector('#nickName');
        let email_info = document.querySelector('#email_info');
        let token = localStorage.getItem('token') || '';
        let xhr = new XMLHttpRequest();
        xhr.open('POST', loginUrl + '/my/userinfo');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', token);
        xhr.send(`id=${user_id.value}&nickname=${nickName.value}&email=${email_info.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('更新失败');
                }
                layer.msg('更新成功');
                // 重新渲染用户信息
                window.parent.getUser();
            }
        }
    })
})