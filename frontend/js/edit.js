$(document).ready(function () {
    $.ajax({
        url: '/api/news/getByID',
        type: 'get',
        contentType: "application/json",
        success: function (res) {
            if (res.retCode == '000000') {
                 $("#title").value = res.data[0].title;
                 $("#content").value = res.data[0].content;
            } else {
                alert('有问题哦');
            }
        }
    })
});