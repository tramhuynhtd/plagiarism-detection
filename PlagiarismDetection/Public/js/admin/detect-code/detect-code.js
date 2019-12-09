$(document).ready(function () {
    danhSachMonHocModule.Init();
    danhSachMonHocModule.InitEvents();
});
var danhSachMonHocModule = (function () {
    var Init = function () {
        try {
            $('[tabindex="1"]').first().focus();
            //InitPage();
            setTabIndexMenu();
        }
        catch (e) {
            console.log('Init: ' + e.message);
        }
    }
    var InitEvents = function () {
        try {
            $('#btn-source-file').on('click', function () {
                ShowSourceFile();
            });
            $('#btn-compare-file').on('click', function () {
                ShowSourceFile();
            });
            //$(document).on('change', '#page-size', function () {
            //    $('#PageSize').val($(this).val());
            //    Search();
            //});
        }
        catch (e) {
            console.log('Init: ' + e.message);
        }
    }
    var ShowSourceFile = function () {
        try {
            $.ajax({
                type: 'GET',
                url: $('#btn-source-file').attr("link"),
                success: function (res) {
                    if (res.Code === 200) {
                        $('#source-file').empty();
                        for (var i = 0; i < res.SourceFile.length - 1; i++) {
                            $('#source-file').append(res.SourceFile[i] + "\n");
                        }
                        $('#source-file').append(res.SourceFile[res.SourceFile.length-1]);
                    }
                }
            });
        }
        catch (e) {
            console.log('ShowSourceFile: ' + e.message);
        }
    }
    //var InitPage = function () {
    //    try {
    //        $('.table-result .pagination').pagination({
    //            items: $('#TotalPages').val(),
    //            itemOnPage: $('#NumberOfRecord').val(),
    //            currentPage: $('#CurrentPage').val(),
    //            onPageClick: function (page, evt) {
    //                $('#CurrentPage').val(page);
    //                Search();
    //            }
    //        });
    //        setTabIndexTable('#div-table-mon-hoc');
    //    }
    //    catch (e) {
    //        console.log('InitPage: ' + e.message);
    //    }
    //}
    //var Search = function () {
    //    try {
    //        // Lấy dữ liệu tìm kiếm
    //        var data = {
    //            TenMonHoc: $('#TenMonHoc').val(),
    //            CurrentPage: $('#CurrentPage').val(),
    //            PageSize: $('#PageSize').val()
    //        }
    //        $.ajax({
    //            type: 'GET',
    //            url: $('#btn-search').attr('link-search'),
    //            data: data,
    //            success: function (res) {
    //                $('[tabindex="1"]').first().focus();
    //                $('#div-table-mon-hoc').html(res);
    //                InitPage();
    //                $('#div-table-mon-hoc input.flat').iCheck({
    //                    checkboxClass: 'icheckbox_flat-green',
    //                    radioClass: 'iradio_flat-green'
    //                });
    //                Common.ChangeUrl('Admin_DanhSachMonHoc', Common.GetLastOfUrl(url.danhSachMonHoc) + '?' + Common.Serialize(data));
    //                window.localStorage.setItem("DanhSachMonHoc", window.location);
    //            }
    //        });
    //    }
    //    catch (e) {
    //        jMessage(0, function (ok) {
    //        }, '<b>Search:</b> ' + e.message, 4);
    //    }
    //}
    return {
        Init: Init,
        InitEvents: InitEvents
    }
})();