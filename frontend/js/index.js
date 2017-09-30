

$(document).ready(function () {
    var userInfo = null;
    var userStr = getCookie('userInfo');
    if (userStr) {
        userInfo = JSON.parse(getCookie('userInfo'));
    }
    if(userInfo) {
        window.location.href = '/list.html';
    }

    $('#login').on('submit', function () {
        var data = {
            name: $('#name').val(),
            password: $('#password').val()
        }
        $.ajax({
            url: '/api/user/login',
            type: 'post',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (res) {
                if (res.retCode == '000000') {
                    // debugger
                    alert(res.msg);
                    setCookie('userInfo', JSON.stringify(res.data));
                    window.location.href = '/list.html';
                } else {
                    alert(res.msg);
                }
            }
        })
        return false;
    })

});