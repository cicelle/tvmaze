// ==UserScript==
// @name         Buttons Watchlist
// @namespace    TVMaze
// @version      0.2
// @description  Adding buttons for status on watchlist and shows episodes page
// @author       cicelle
// @include      http://www.tvmaze.com/watchlist*
// @include      http://www.tvmaze.com/shows/*/episodes
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/watchlist-buttons.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    var path = window.location.pathname.split('/')[1];
    $('head').append('<style>'+
                     '.buttons{padding:5px 10px; cursor:pointer;display:block;text-align:center;}'+
                     'th:nth-child(4),th:nth-child(5),th:nth-child(6),th:nth-child(7){text-align:center;}'+
                     'td:nth-child(4),td:nth-child(5),td:nth-child(6),td:nth-child(7){padding: 0;}'+
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
        else if(path == 'watchlist'){
            var id = $(this).parents('[data-show_id]').attr('data-show_id');
            var thistable = $('[data-show_id='+id+']').parents('table');
            setTimeout(function(){addcolumns('[data-show_id='+id+'] table');} , 350);
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
})();