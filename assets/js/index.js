// 项目根路径
const loginUrl = 'http://api-breakingnews-web.itheima.net';
// 获取用户信息并渲染
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
                console.log(user);
                setHead(user);
            } else {
                // 设置用户的权限,没有token禁止进入后台
                let failMessage = JSON.parse(xhr.responseText);
                if (failMessage.status === 1 && failMessage.message === '身份认证失败！') {
                    //清空token信息
                    localStorage.removeItem('token');
                    // 退出到登录页面
                    location.href = '../../login.html';
                }
            }
        }
    }
}
// 渲染用户头像和名称
function setHead(user) {
    // 图片头像
    let userPics = document.querySelectorAll('#userPic');
    // 文字头像
    let textPics = document.querySelectorAll('.text-img');
    let welcome = document.querySelector('#welcome');
    // 判断用户是否有设置昵称
    let uname = user.nickname || user.username;
    // 将昵称/姓名渲染到欢迎页面
    welcome.innerHTML = '欢迎 ' + uname;
    let pic_text = uname.slice(0, 1).toUpperCase();
    // 循环根据用户有无设置头像显示相应的头像
    if (user.user_pic) {
        // 有头像就设置图片头像
        for (let i = 0; i < userPics.length; i++) {
            userPics[i].src = user.user_pic;
            userPics[i].style.display = 'inline-block';
        }
        for (let i = 0; i < textPics.length; i++) {
            textPics[i].style.display = 'none';
        }
    } else {
        // 无头像就设置文字头像
        for (let i = 0; i < userPics.length; i++) {
            userPics[i].style.display = 'none';
        }
        for (let i = 0; i < textPics.length; i++) {
            textPics[i].innerHTML = pic_text;
            textPics[i].style.display = 'inline-block';
        }
    }
}
window.addEventListener('load', function() {
    getUser();
    // 实现退出功能
    let layer = layui.layer;
    let logOut = document.querySelector('#logOut');
    // 点击退出弹出询问框
    logOut.addEventListener('click', function() {
        layer.confirm('是否退出', { icon: 3, title: '提示' }, function(index) {
            //清空token信息
            localStorage.removeItem('token');
            // 退出到登录页面
            location.href = '../../login.html';
            // 关闭弹出层
            layer.close(index);
        });
    });
});