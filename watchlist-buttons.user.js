// ==UserScript==
// @name         Buttons Watchlist
// @namespace    TVMaze
// @version      0.3
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
    });
    function addcolumns(){
            $('tbody tr').append('<td><span data-type="2" class="buttons"><i class="fa fa-ban"></i></span></td>'+
                               '<td><span data-type="" class="buttons"><i class="fa fa-eye-slash"></i></span></td>'+
                               '<td><span data-type="1" class="buttons"><i class="fa fa-cloud"></i></span></td>'+
                               '<td><span data-type="0" class="buttons"><i class="fa fa-eye"></i></span></td>');
            $('thead tr').append('<th>S</th><th>U</th><th>A</th><th>W</th>');
            $('tbody').each(function(){
                var val = $(this).find("select").val();
                $(this).find('span[data-type="' + val  + '"]').parent().addClass("checked");
            });
    }
    addcolumns();
})();
