$(function() {
    // 项目根路径
    const loginUrl = 'http://api-breakingnews-web.itheima.net';
    let layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };
    // 1.3 创建裁剪区域
    $image.cropper(options);
    // 点击上传按钮上传文件
    let avatar_upload = document.querySelector('#avatar_upload');
    let upload = document.querySelector('#upload');
    upload.addEventListener('click', function() {
        avatar_upload.click();
    });
    // 给文件添加change事件
    avatar_upload.addEventListener('change', function(e) {
        if (e.target.files === 0) {
            return layer.msg('请选择图片');
        }
        let file = e.target.files[0];
        // 创建相应的url地址
        let imgUrl = URL.createObjectURL(file);
        // 再调用cropper插件来实现替换效果
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 上传头像到服务器
    let btnUpload = document.querySelector('#btnUpload');
    btnUpload.addEventListener('click', function() {
        // 获取图片的url
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 有无token
        let token = localStorage.getItem('token') || '';
        // 发起修改的请求jquery
        /* $.ajax({
            method: 'POST',
            url: loginUrl + '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            headers: {
                Authorization: token
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！');
                window.parent.getUser();
            }
        }) */
        // 原生ajax
        let xhr = new XMLHttpRequest();
        xhr.open('POST', loginUrl + '/my/update/avatar');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', token);
        // 将base64格式图片进行编码发送服务器
        xhr.send('avatar=' + encodeURIComponent(dataURL));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！');
                // 更新用户信息
                window.parent.getUser();
            }
        }
    })
})