$(document).ready(function () {
    var userInfo = JSON.parse(getCookie('userInfo') || '{}');
    if(!userInfo) {
        alert('当前未登录');
        window.location.href = '/';
    }
    /**
     * 格式化时间戳  - 时间毫秒数转化为固定格式的时间字符串
     * @param timestamp
     * @param dateFormate
     * @description 其中dateFormate是有YYYY MM DD hh mm ss组成,可以是YYYY-MM-DD 也可以是YYYY-MM-DD hh:mm:ss
     * 如果不传的话,默认为: YYYY-MM-DD hh:mm:ss
     * @example formatTimestamp(1464314911403);
     *          formatTimestamp(1464314911403, 'yyyyMMddhhmmss');
     *          formatTimestamp(1464314911403,'YYYY-MM-DD');
     */
    function formatTimestamp(timestamp, dateFormate) {
        var datemills = parseInt(timestamp);
        if (isNaN(datemills)) {
            console.error("Wrong timestamp, must be a number!");
            return;
        }
        if (dateFormate == undefined) {
            dateFormate = "YYYY-MM-DD hh:mm:ss";
        }
        var date = new Date(datemills);
        var year = "" + date.getFullYear();
        var month = (date.getMonth() > 8 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1));
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var second = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        var datestr = dateFormate.replace(/yyyy/gi, year).replace('MM', month).replace(/dd/gi, day)
            .replace("hh", hour).replace("mm", minute).replace("ss", second);
        return datestr;
    }
    $.ajax({
        url: '/api/news/getList',
        type: 'get',
        contentType: "application/json",
        success: function (res) {
            if (res.retCode == '000000') {
                var tableList = '';
                for (var i = 0; i < res.data.length; i++) {
                    tableList += '<tr><td>' + res.data[i].title + '</td>' + '<td>' + res.data[i].content + '</td>' + '<td>' + res.data[i].tips + '</td>' + '<td>' + formatTimestamp(res.data[i].created, 'YYYY-MM-DD') + '</td>' + '<td>' + formatTimestamp(res.data[i].updated, 'YYYY-MM-DD') + '</td>' + '<td><a class="btn btn-default" href="/edit.html?id=' + res.data[i]._id + '" role="button">修改</a><a class="btn btn-default" href="javascript:;" role="button"><span data-aid="' + res.data[i]._id + '">删除</span></a>' + '</td></tr>';
                }
                $('#newsList').append(tableList);
            } else {
                alert('出毛病了兄弟');
            }
        }
    });

    $('#newsList').on('click', 'span', function (e) {
        var target = e.target;
        if (target.tagName.toLowerCase() == 'span') {
            var id = target.dataset && target.dataset.aid;
            var isDelete = confirm('你确定要删除吗');

            if (isDelete && id) {
                var data = {
                    id: id
                };
                $.ajax({
                    url: '/api/news/delete',
                    type: 'post',
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (res) {
                        if (res.retCode == '000000') {
                            alert('你已经失去了你的宝宝');
                            window.location.reload();
                        } else {
                            alert('出毛病了兄弟');
                        }
                    }
                });
            }
        }

    })

    // var newsList = document.getElementById('newsList');
    // newsList.onclick = function (e) {
    //     debugger
    // }

    function deleteNews(id) {
        var data = {};
        data.id = id;
        debugger
        $.ajax({
            url: '/api/news/delete',
            type: 'get',
            contentType: "application/json",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.retCode == '000000') {
                    alert('删除成功');
                    window.location.href = '/list.html';
                } else {
                    alert('出毛病了兄弟');
                }
            }
        });
    }
});