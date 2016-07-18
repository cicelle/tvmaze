// ==UserScript==
// @name         Buttons calendar
// @namespace    TVMaze
// @version      0.1
// @author       cicelle
// @include      http://www.tvmaze.com/calendar*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/calendar-buttons.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>li p{margin-bottom: 0; margin-top: 5px; display: flex; justify-content: space-between;}'+
                     'li p span{cursor:pointer; padding: 2px;}'+
                     'li.watched p span[data-type="0"],li.acquired p span[data-type="1"]{background-color: #000; color: #fff; cursor: default;}'+
                     '@media screen and (max-width: 600px) {'+
                     'li{position: relative;}'+
                     'li p {float: right; margin-top: 0px;}'+
                     'li p span{margin:0 10px;}'+
                     'li.entry:after{content:"";display:block;height:0;overflow:hidden;clear:both;}'+
                     '}'+
                     '</style>');
    $('.episodes li').each(function(){
        $(this).append('<p><span data-type="2" class="buttons"><i class="fa fa-ban"></i></span>'+
            '<span data-type="" class="buttons"><i class="fa fa-eye-slash"></i></span>'+
            '<span data-type="1" class="buttons"><i class="fa fa-cloud"></i></span>'+
            '<span data-type="0" class="buttons"><i class="fa fa-eye"></i></span></p>');
    });
    if($('.today').length > 0){
        window.scrollTo(0, $('.today').offset().top);
    }
    $('body').on('click', '.buttons', function(){
        var li = $(this).parent().parent();
        var type = $(this).attr('data-type');
        var ad = $(this).parent().prev('a').attr('href').split('/');
        var id = ad[2];
        $.post('/watch/set?episode_id=' + id, {
            type: type
        }, function() {
            if(type == '0'){
                $(li).removeClass('acquired').addClass('watched');
            }else if(type == '1'){
                $(li).removeClass('watched').addClass('acquired');
            }else{
                $(li).removeClass('watched').removeClass('acquired');
            }
        });
    });
})();