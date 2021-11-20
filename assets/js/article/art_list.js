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
    // 定义查询的参数对象,以后会添加到请求中
    let q = {
        pagenum: 1, //页码值默认为1
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };
    // template存放的主体
    let listContent = document.querySelector('#listContent');
    // 渲染文章列表的函数
    function initArtList() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${loginUrl}/my/article/list?pagenum=${q.pagenum}&pagesize=${q.pagesize}&cate_id=${q.cate_id}&state=${q.state}`);
        xhr.setRequestHeader('Authorization', token);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                if (text.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                console.log(text);
                let tpl = template('tpl-table', text);
                listContent.innerHTML = tpl;
                let total = text.total;
                if (total === 0) {
                    layer.msg('您还没有文章，请发表文章');
                    total = 1;
                }
                renderPage(total)
            }
        }
    };
    // 定义补0函数
    function zeroPad(a) {
        return a > 9 ? a : '0' + a
    }
    // 定义过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = zeroPad(dt.getMonth() + 1);
        let d = zeroPad(dt.getDate());
        let h = zeroPad(dt.getHours());
        let mm = zeroPad(dt.getMinutes());
        let ss = zeroPad(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss
    };
    // 调用渲染文章的函数
    initArtList();
    // 获取文章分类的选项
    let art_cate = document.querySelector('#art_cate');
    // 定义初始化文章类别的函数
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
    //调用初始化文章类别的函数
    initCate();
    // 筛选功能
    let form_search = document.querySelector('#form-search');
    form_search.addEventListener('submit', function(e) {
        e.preventDefault();
        // 获取选项中的值
        let art_cate = document.querySelector('#art_cate').value;
        let art_state = document.querySelector('#art_state').value;
        q.cate_id = art_cate;
        q.state = art_state;
        // 再次根据选项渲染数据
        initArtList();
        console.log(art_cate);
    });
    // 定义分页的方法
    function renderPage(total) {
        laypage.render({
            // 指向存放分页的容器
            elem: 'pageBox',
            // 数据总数
            count: total,
            // 每页显示的条数
            limit: q.pagesize,
            // 现在第几页
            curr: q.pagenum,
            // 设置每页条数的选择项
            limits: [2, 5, 10, 20],
            // 自定义分页功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 点击分页和首次都会触发jump回调函数
            jump: function(obj, first) {
                // 拿到最新页码值
                q.pagenum = obj.curr;
                // 拿到最新条目数
                q.pagesize = obj.limit;
                // 解决死循环问题
                // 如果通过分页点击调用jump那么first就是undefind
                if (!first) {
                    initArtList();
                }
            }
        })
    };
    // 删除文章功能
    $('body').on('click', '.btn-delete', function(e) {
        e.preventDefault();
        // 拿到页面删除按钮个数
        let len = document.querySelectorAll('.btn-delete').length;
        let removeId = this.dataset['id'];
        // 提示是否删除
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', loginUrl + '/my/article/delete/' + removeId);
            xhr.setRequestHeader('Authorization', token);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let text = JSON.parse(xhr.responseText);
                    if (text.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 如果删除按钮个数为一,那么删除后页面就没有数据了
                    if (len === 1) {
                        //这时让页码减一，页码最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 删除后刷新文章列表
                    initArtList();
                    // 关闭弹出层
                    layer.close(index);
                }
            }
        });
    });
})