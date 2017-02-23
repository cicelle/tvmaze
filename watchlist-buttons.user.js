// ==UserScript==
// @name         Buttons Watchlist
// @namespace    TVMaze
// @version      1.1
// @description  Adding buttons for status on watchlist and shows episodes page
// @author       cicelle
// @match        http://www.tvmaze.com/watchlist*
// @match        http://www.tvmaze.com/shows/*/episodes*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/watchlist-buttons.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    var path = window.location.pathname.split('/')[1];
    var l = $('.watchlist-show').length;
    var unseen = false;
    $('head').append('<style>'+
                     '.buttons{padding:5px 10px; cursor:pointer;display:block;text-align:center;}'+
                     'th:nth-child(2){min-width:110px !important;}'+
                     'th:nth-last-child(-n+4){text-align:center;}'+
                     'td:nth-last-child(-n+4){padding: 0;}'+
                     'table tr td,.watch-list tr td:nth-child(3){padding:1px 5px;}'+
                     '.checked{background:#ccc;}'+
                     '</style>');
    $('body').on('click', '.buttons', function(){
        var type = $(this).attr('data-type');
        var select = $(this).parents('tr').find('select');
        select.val(type);
        $(select).trigger('change');
        if(path == 'shows'){
            $(this).parents('tr').find('.checked').removeClass('checked');
            $(this).parent().addClass('checked');
        }
        else if(type == 1 && path == 'watchlist'){
            $(this).parents('tr').find('td + td + td +td').removeClass('checked');
            $(this).parents('tr').find('td:nth-child(6)').addClass('checked');
        }
    });
    function addcolumns(selector){
        $(selector).each(function(){
            $(this).find('tbody tr').each(function(){
                $(this).append('<td><span data-type="2" class="buttons"><i class="fa fa-ban"></i></span></td>'+
                               '<td><span data-type="" class="buttons"><i class="fa fa-eye-slash"></i></span></td>'+
                               '<td><span data-type="1" class="buttons"><i class="fa fa-cloud"></i></span></td>'+
                               '<td><span data-type="0" class="buttons"><i class="fa fa-eye"></i></span></td>');
            });
            $(this).find('thead tr').each(function(){
                $(this).append('<th>S</th><th>U</th><th>A</th><th>W</th>');
            });
            $(this).find('tbody select').each(function(){
                var val = $(this).val();
                if(val == 1){
                    $(this).parent().next().next().next().addClass('checked');
                }else if(val == ''){
                    $(this).parent().next().next().addClass('checked');
                }else if(val == 2){
                    $(this).parent().next().addClass('checked');
                }else if(val == 0){
                    $(this).parent().next().next().next().next().addClass('checked');
                }
            });
        });
    }
    if(path == 'shows'){
        addcolumns('table');
    }else if(path == 'watchlist'){
        $('[data-show_id]').each(function(){
            var i = $(this).attr('data-show_id');
            addcolumns('[data-show_id='+i+'] table');
        });
    }
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        addcolumns($(mutations[0].target));
        var selector = $(mutations[0].target).find('.watched-eps');
        var c = $(selector).html().split(' / ');
        var unseen = parseInt(c[1]) - parseInt(c[0]);
        $(selector).attr('data-unseen', unseen).append('<span>['+unseen+']</span>');
    });
    for(var j = 0; j < l; j++){
        observer.observe($('.watchlist-show')[j], {
            childList: true
        });
    }
    setTimeout(function(){
        unseen = ($('[data-unseen]').length != 0);
    }, 500);
})();