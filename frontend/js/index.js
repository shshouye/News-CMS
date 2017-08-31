

$(document).ready(function () {
    $("#submit").click(function () {
        // debugger
        $.ajax({
            url: '/api/news/list',
            type: 'get',
            contentType: "application/json",
            data: JSON.stringify({
                data: 'hello world'
            }),
            success: function (res) {
                if(res.retCode == '000000') {
                    alert(res.status);
                } else {
                    alert('有问题哦');
                }
            }
        })
        // $.post("/api/news/update",
        //     {
        //         data: 'hello world'
        //     },
        //     function (result) {
        //         debugger
        //         if(res.retCode == '000000') {
        //             alert(res.status);
        //         } else {
        //             alert('有问题哦');
        //         }
        //     });
    });
});