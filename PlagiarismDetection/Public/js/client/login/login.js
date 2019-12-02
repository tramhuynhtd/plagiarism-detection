$(document).ready(function () {
    loginModel.Init();
    loginModel.InitEvents();
});

var loginModel = (function () {
    var obj = {
        'Username': { 'type': 'text', 'attr': { 'maxlength': 50, 'tabindex': 1, 'class': 'required' } }
    ,   'Password': { 'type': 'password', 'attr': { 'maxlength': 50, 'tabindex': 2, 'class': 'required' } }
    };
    var Init = function () {
        try {
            Common.InitItem(obj);
            _fillRemember();
        }
        catch (e) {
            console.log('Init: ' + e.message);
        }
    };
    var InitEvents = function () {
        try {
            $('#btn-login').on('click', function () {
                _submitLogin();
            });
            document.onkeyup = function (event) {
                if (event.which == 13 || event.keyCode == 13) {
                    _submitLogin();
                }
            };
        }
        catch (e) {
            console.log('InitEventLogin: ' + e.message);
        }
    };
    var _submitLogin = function () {
        try {
            if (ValidateModule.Validate(obj)) {
                var data = Common.GetData(obj);
                data.Password = Secure.EncodeMD5(data.Password);
                $.ajax({
                    type: $('#form-login').attr('method'),
                    url: $('#form-login').attr('action'),
                    dataType: 'json',
                    data: data,
                    success: _checkLoginSuccess
                });
            }
        }
        catch (e) {
            console.log('SubmitLogin: ' + e.message);
        }
    };
    var _checkLoginSuccess = function (res) {
        try {
            if (res.Code == 200) {
                $.cookie('token', res.Data.token, { expires: 7, path: '/' });
                _checkRemember();
                window.location = "/";
            } else if (res.Code == 201) {
                ValidateModule.FillError(res.ListError);
                ValidateModule.FocusFirstError();
            } else {
                Notification.Alert(res.MsgNo);
            }
        }
        catch (e) {
            console.log('CheckLoginSuccess: ' + e.message);
        }
    };
    var _fillRemember = function () {
        try {
            if (window.localStorage.getItem("Username")) {
                $('#Username').val(Secure.DecodeBase64(window.localStorage.getItem("Username")));
                $('#Password').val(Secure.DecodeBase64(window.localStorage.getItem("Password")));
                $('#Remember').prop('checked', true);
            }
        }
        catch (e) {
            console.log('FillRemember: ' + e.message);
        }
    };
    var _checkRemember = function () {
        try {
            if ($('#Remember').is(':checked')) {
                window.localStorage.setItem("Username", Secure.EncodeBase64($('#Username').val()));
                window.localStorage.setItem("Password", Secure.EncodeBase64($('#Password').val()));
            }
            else {
                window.localStorage.removeItem("Username");
                window.localStorage.removeItem("Password");
            }
        }
        catch (e) {
            console.log('CheckRemember: ' + e.message);
        }
    };
    return {
        Init: Init,
        InitEvents: InitEvents
    };
})();
