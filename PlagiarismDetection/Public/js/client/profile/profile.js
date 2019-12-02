$(document).ready(function () {
    profileModel.Init();
    profileModel.InitEvents();
});
var profileModel = (function () {
    var obj = {
        'NgaySinh': { 'type': 'tel', 'attr': { 'maxlength': 10, 'tabindex': 1 } }
        , 'GioiTinh': { 'type': 'select', 'attr': { 'tabindex': 2, 'class': '' } }
        , 'SoDienThoai': { 'type': 'text', 'attr': { 'maxlength': 12, 'tabindex': 3, 'class': '' } }
        , 'CMND': { 'type': 'text', 'attr': { 'maxlength': 15, 'tabindex': 4, 'class': '' } }
        , 'DiaChi': { 'type': 'text', 'attr': { 'maxlength': 200, 'tabindex': 5, 'class': '' } }
    };
    var _obj = {
        'MatKhauCu': { 'type': 'text', 'attr': { 'maxlength': 50, 'tabindex': 7, 'class': 'required' } }
        , 'MatKhauMoi': { 'type': 'text', 'attr': { 'maxlength': 50, 'tabindex': 8, 'class': 'required' } }
    };
    var Init = function () {
        try {
            Common.InitItem(obj);
            Common.InitItem(_obj);
            DateModule.InitDatePicker();
            ValidateConfirmPassword();
        }
        catch (e) {
            console.log('Init: ' + e.message);
        }
    };
    var InitEvents = function () {
        try {
            $('#btn-luu-tai-khoan').on('click', LuuTaiKhoan);
            $('#btn-cap-nhat-mat-khau').on('click', CapNhatMatKhau);
            $('#MatKhauMoi').on('keyup', CheckPassword);
            $('#XacNhanMatKhau').on('keyup', ValidateConfirmPassword);
        }
        catch (e) {
            console.log('Init: ' + e.message);
        }
    }
    var LuuTaiKhoan = function () {
        try {
            if (ValidateModule.Validate(obj)) {
                var data = Common.GetData(obj);
                data.IdTaiKhoan = $('#IdTaiKhoan').val();
                $.ajax({
                    type: 'POST',
                    url: url.updateProfile,
                    dataType: 'json',
                    data: data,
                    success: function (res) {
                        if (res.Code == 200) {
                            Notification.Alert(MSG_NO.SAVE_DATA_SUCCESS, function (ok) {
                                Common.BackToList("Profile", url.profile);
                            });
                        } else if (res.Code == 201) {
                            ValidateModule.FillError(res.ListError);
                            ValidateModule.FocusFirstError();
                        } else {
                            Notification.Alert(res.MsgNo);
                        }
                    }
                });
            }

        }
        catch (e) {
            console.log('Cập nhật tài khoản: ' + e.message);
        }
    };
    var CapNhatMatKhau = function () {
        try {
            var validate = ValidateModule.Validate(_obj);
            var validatePass = CheckPassword();
            var confirmPass = ValidateConfirmPassword();
            if (validate && validatePass && confirmPass) {
                var data = Common.GetData(_obj);
                data.MatKhauMoi = Secure.EncodeMD5(data.MatKhauMoi);
                data.MatKhauCu = Secure.EncodeMD5(data.MatKhauCu);
                data.IdTaiKhoan = $('#IdTaiKhoan').val();
                $.ajax({
                    type: 'POST',
                    url: url.updatePassword,
                    dataType: 'json',
                    data: data,
                    success: function (res) {
                        if (res.Code === 200) {
                            $.cookie('token', res.Data.token, { expires: 7, path: '/' });
                            Notification.Alert(MSG_NO.SAVE_DATA_SUCCESS, function (ok) {
                                Common.BackToList("Profile", url.profile);
                            });
                        } else if (res.Code === 201) {
                            ValidateModule.FillError(res.ListError);
                            ValidateModule.FocusFirstError();
                        } else {
                            Notification.Alert(res.MsgNo);
                        }
                    }
                });
            }
        }
        catch (e) {
            console.log('Cập nhật mật khẩu' + e.message);
        }
    }

    var ValidateConfirmPassword = function () {
        try {
            if ($('#MatKhauMoi').val() == $('#XacNhanMatKhau').val()) {
                $('#XacNhanMatKhau').RemoveError();
                return true;
            }
            else {
                $('#XacNhanMatKhau').ItemError(_msg[MSG_NO.CORNFIRM_PASSWORD].content);
                return false;
            }
        }
        catch (e) {
            console.log('ValidateConfirmPassword: ' + e.message);
            return false;
        }
    }
    var CheckPassword = function () {
        try {
            var passw = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
            if ($('#MatKhauMoi').val().match(passw)) {
                $('#MatKhauMoi').RemoveError();
                return true;
            }
            else {
                $('#MatKhauMoi').ItemError(_msg[MSG_NO.PASSWORD_WRONG_fORMAT].content);
                return false;
            }
        }
        catch (e) {
            console.log('CheckPassword: ' + e.message);
            return false;
        }
    }
    return {
        Init: Init,
        InitEvents: InitEvents
    };
})();