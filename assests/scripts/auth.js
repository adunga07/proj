$(document).ready(function() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        console.log('Login form submitted');

        var username = $('#username').val();
        var password = $('#password').val();

        //Request orders data from the api endpoint
        const settings = {
            async: true,
            crossDomain: true,
            url: 'https://localhost:7084/api/Auth/login-user',
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            data: JSON.stringify({ email: username, password: password })
        };

        $.ajax(settings).done(function (response) {
            
            //Save token to localstorage
            localStorage.setItem('token', response.token);

            //Redirect to orders page
            alert('Authorized: Redirecting to home page');
            window.location.href = 'index.html';
            
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Error = ', errorThrown);
            console.log('Text Status = ', textStatus);
            console.log('jqXHR = ', jqXHR);

            // Check for a 401 Unauthorized response
            if (jqXHR.status === 401) {
                alert('Unauthorized: Redirecting to login');
                window.location.href = 'login.html';
            } else {
                alert('Error occurred while fetching orders');
            }
        });
    });
});