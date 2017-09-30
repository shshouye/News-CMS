$(document).ready(function () {
    var userInfo = JSON.parse(getCookie('userInfo') || '{}');
    if(!userInfo) {
        alert('当前未登录');
        window.location.href = '/';
    }
    function getQuery() {
        var url = url || window.location.href;
        var index = url.indexOf("?"); //获取?字符位置
        if (index > -1) {
            url = url.substr(index + 1); //截取URL参数部分
            var argArr = new Array();
            argArr = url.split("&"); //将各参数分离
            //将参数数组部分转换为JSON数据
            var str = '{';
            var len = argArr.length;
            for (var i = 0; i < len; i++) {
                var separator = argArr[i].indexOf('=');
                //判断最后一个参数是否有值
                if (separator == -1) {
                    str += ',"' + argArr[i] + '":"undefined"';
                    continue;
                }
                var key = argArr[i].substr(0, separator);
                var val = argArr[i].substr(separator + 1);
                var comma = ',';
                if (i == 0) {
                    comma = '';
                }
                str += comma + '\"' + key + '\":' + '\"' + val + '\"';
            }
            str += '}';
            return JSON.parse(str);
        } else {
            return {};
        }
    }

    var query = getQuery();
    if (query.id) {
        $.ajax({
            url: '/api/news/getByID',
            type: 'get',
            contentType: "application/json",
            data: {
                id: query.id
            },
            success: function (res) {
                if (res.retCode == '000000') {
                    $("#title").val(res.data.title);
                    $("#content").val(res.data.content);
                } else {
                    alert('出毛病了兄弟');
                }
            }
        })
    }


    $('#save').on('submit', function () {
        if (query.id) {
            var data = {};
            data.title = $('#title').val();
            data.content = $('#content').val();
            data.tips = $('#tips').val();
            data.id = query.id;

            // debugger
            $.ajax({
                url: '/api/news/update',
                type: 'post',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.retCode == '000000') {
                        alert('修改成功');
                        window.location.href = '/list.html';
                        console.log(res.data);
                    } else {
                        alert('出毛病了兄弟');
                    }
                }
            })
        } else {
            var data = {};
            data.title = $('#title').val();
            data.content = $('#content').val();
            data.tips = $('#tips').val();
            // debugger
            $.ajax({
                url: '/api/news/add',
                type: 'post',
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.retCode == '000000') {
                        alert('新增成功');
                        window.location.href = '/list.html';
                        console.log(res.data);
                    } else {
                        alert('出毛病了兄弟');
                    }
                }
            })
        }
        return false;
    })
});