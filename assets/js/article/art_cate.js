// 项目根目录
const loginUrl = 'http://www.liulongbin.top:3007';
// 定义layer对象
let layer = layui.layer;
// 添加弹出框的index
let addInedx = null;
// 添加文章按钮
let addArtCate = document.querySelector('#addArtCate');
// 添加文章的表单
let add_content = document.querySelector('#add-content');
// 表格主体
let tbody = document.querySelector('#tbody');
// 修改弹出框index
let editInedx = null;
// 编辑文章的表单
let edit_content = document.querySelector('#edit-content');
// token是否存在
let token = localStorage.getItem('token') || '';
// 刷新文章列表
function initArtCateList() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', loginUrl + '/my/article/cates');
    xhr.setRequestHeader('Authorization', token);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // status为0表示获取成功
            if (JSON.parse(xhr.responseText).status === 0) {
                let user = JSON.parse(xhr.responseText);
                console.log(user);
                let tplStr = template('art-tpl', user);

                tbody.innerHTML = tplStr;
            }
        }
    }
}
window.addEventListener('load', function() {
    initArtCateList();
    // 添加文章分类
    // 点击弹出添加框
    addArtCate.addEventListener('click', function() {
        // 指定弹出框的类型
        addInedx = layer.open({
            type: 1,
            title: '添加文章分类',
            content: add_content.innerHTML,
            area: ['500px', '250px']
        });
    });
    // 将数据上传服务器
    $('body').on('submit', '#form_add', function(e) {
        // 分类名称
        let artCateName = document.querySelector('#artCateName');
        // 分类别名
        let artCateAlias = document.querySelector('#artCateAlias');
        // 阻止表单提交
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open('POST', loginUrl + '/my/article/addcates');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', token);
        xhr.send(`name=${artCateName.value}&alias=${artCateAlias.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('添加失败');
                }
                layer.msg('添加成功');
                // 刷新页面列表
                initArtCateList();
                // 关闭弹出层
                layer.close(addInedx);
            }
        }
    });
    // 点击弹出修改表单
    let editInedx = null;
    $('tbody').on('click', '.editCate', function() {
        // 指定弹出层的大小和html
        editInedx = layer.open({
            type: 1,
            title: '修改文章分类',
            // 使用哪个html页面
            content: edit_content.innerHTML,
            // 大小
            area: ['500px', '250px']
        });
        let dataId = this.dataset['id'];
        let xhr = new XMLHttpRequest();
        xhr.open('GET', loginUrl + '/my/article/cates/' + dataId);
        xhr.setRequestHeader('Authorization', token);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                if (text.status !== 0) {
                    return layer.msg('获取名称和别名失败');
                }
                // 给弹出层赋值
                layui.form.val('edit-filter', text.data);
            }
        }
    });
    // 更新数据到服务器
    $('body').on('submit', '.form_edit', function(e) {
        // 阻止表单提交
        e.preventDefault();
        let xhr = new XMLHttpRequest();
        // 修改的id号
        let editId = document.querySelector('#editId');
        // 修改的类名
        let editCateName = document.querySelector('#editCateName');
        // 修改的别名
        let editCateAlias = document.querySelector('#editCateAlias');
        xhr.open('POST', loginUrl + '/my/article/updatecate');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', token);
        xhr.send(`Id=${editId.value}&name=${editCateName.value}&alias=${editCateAlias.value}`);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let text = JSON.parse(xhr.responseText);
                // status不为0表示登录失败，退出当前操作
                if (text.status !== 0) {
                    return layer.msg('更新失败');
                }
                layer.msg('更新成功');
                // 刷新列表
                initArtCateList();
                // 关闭弹出层
                layer.close(editInedx);
            }
        }
    });
    // 删除类名功能
    $('body').on('click', '.removeCate', function(e) {
        e.preventDefault();
        let removeId = this.dataset['removeid'];
        // 提示是否删除
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', loginUrl + '/my/article/deletecate/' + removeId);
            xhr.setRequestHeader('Authorization', token);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let text = JSON.parse(xhr.responseText);
                    if (text.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 删除后刷新列表
                    initArtCateList();
                    // 关闭弹出层
                    layer.close(index);
                }
            }
        });
    });

})