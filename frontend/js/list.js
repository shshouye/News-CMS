$(document).ready(function () {
    $.ajax({
        url: '/api/news/list',
        type: 'get',
        contentType: "application/json",
        success: function (res) {
            if (res.retCode == '000000') {
                var tableList = '';
                for (var i = 0; i < res.data.length; i++) {
                    tableList = '<tr><td>' + res.data[i].title + '</td>' + '<td>' + res.data[i].content + '</td>' + '<td>' + res.data[i].created + '</td>' + '<td>' + res.data[i].updated + '</td>' + '<td><a class="btn btn-default" href="/edit.html?id=' + res.data[i].id + ' role="button">修改</a><a class="btn btn-default" href="#" role="button">删除</a>' +  '</td></tr>';
                    $('#newsList').append(tableList);
                }
            } else {
                alert('有问题哦');
            }
        }
    })
});