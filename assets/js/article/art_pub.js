window.addEventListener('load', function() {
    // 项目根目录
    const loginUrl = 'http://www.liulongbin.top:3007';
    // 定义layer对象
    let layer = layui.layer;
    // 定义form对象
    let form = layui.form;
    // 定义laypage对象
    let laypage = layui.laypage;
    // token是否存在
    let token = localStorage.getItem('token') || '';
    // 获取文章分类的选项
    let art_cate = document.querySelector('#art_cate');
    // 调用文章类别选项方法
    initCate();
    // 定义获取并渲染文章类别选项方法
    function initCate() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${loginUrl}/my/article/cates`);
        xhr.setRequestHeader('Authorization', token);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                if (text.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 用模板引擎定义文章分类的选项
                let tpl = template('tpl-cate', text);
                art_cate.innerHTML = tpl;
                // 重新渲染页面
                form.render();
            }
        }
    };
    // 调用富文本编译器的函数
    initEditor();
    // 图片封面裁剪区域cropper插件制作
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 点击选择封面
    let selectCover = document.querySelector('#selectCover');
    let coverFile = document.querySelector('#coverFile');
    selectCover.addEventListener('click', function() {
        coverFile.click();
    });
    // 监听文件的change事件
    coverFile.addEventListener('change', function(e) {
        // 拿到已经选择文件的数组
        let files = e.target.files;
        // 判断有无文件
        if (files.length === 0) {
            return
        }
        // 将第一个文件转化为地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 再将选择的图片渲染到裁剪区域cropper插件
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });
    // 将文章存为草稿
    let artState = '已发布';
    let draft = document.querySelector('#draft');
    draft.addEventListener('click', function() {
        artState = '草稿';
    });
    // 监听表单提交事件添加formdata对象
    let form_pub = document.querySelector('#form_pub');
    form_pub.addEventListener('submit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        console.log(11);
        var fd = new FormData(this);
        fd.append('state', artState);
        // 将图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象blob后，进行后续的操作
                fd.append('cover_img', blob);
                // 发ajax请求
                let xhr = new XMLHttpRequest();
                xhr.open('POST', loginUrl + '/my/article/add');
                xhr.setRequestHeader('Authorization', token);
                xhr.send(fd);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let text = JSON.parse(xhr.responseText);
                        console.log(text);
                        // status不为0表示登录失败，退出当前操作
                        if (text.status !== 0) {
                            return layer.msg('发布失败');
                        }
                        layer.msg('发布成功');
                        location.href = '../../../article/art_list.html';
                    }
                };
                // publishArticle(fd);
            });


    });
    // 发送请求函数
    /*  function publishArticle(fd) {
         $.ajax({
             method: 'POST',
             url: 'http://www.liulongbin.top:3007/my/article/add',
             data: fd,
             // 注意：如果向服务器提交的是 FormData 格式的数据，
             // 必须添加以下两个配置项
             contentType: false,
             processData: false,
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg('发布文章失败！');
                 }
                 layer.msg('发布文章成功！');
                 // 发布文章成功后，跳转到文章列表页面
                 location.href = '../../../article/art_list.html'
             }
         });
     } */
})