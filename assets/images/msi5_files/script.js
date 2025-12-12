$(function () {

    $(".me_buy a").bind("click", function () {

        var id = $(this).attr("data-id");

        var target_top = $("#area" + id).offset().top;

        var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');


        $body.animate({
            scrollTop: target_top
        }, 800);

    })
})