// ==UserScript==
// @name         Buttons Watchlist
// @namespace    TVMaze
// @version      1
// @description  Adding buttons for status
// @author       cecile
// @include      http://www.tvmaze.com/watchlist*
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>'+
                     '.buttons{padding:0 5px; cursor:pointer;}'+
                     'th:nth-child(4),th:nth-child(5),th:nth-child(6),th:nth-child(7){text-align:center;}'+
                     'td:nth-child(4),td:nth-child(5),td:nth-child(6),td:nth-child(7){text-align:center;}'+
                     '.checked{background:#ccc;}'+
                     '</style>');
    $('thead tr').each(function(){
        $(this).append('<th>S</th><th>U</th><th>A</th><th>W</th>');
    });
    $('tbody tr').each(function(){
        $(this).append('<td><span data-type="2" class="buttons"><i class="fa fa-ban fa-lg"></i></span></td>'+
                     '<td><span data-type="" class="buttons"><i class="fa fa-eye-slash fa-lg"></i></span></td>'+
                     '<td><span data-type="1" class="buttons"><i class="fa fa-cloud fa-lg"></i></span></td>'+
                     '<td><span data-type="0" class="buttons"><i class="fa fa-eye fa-lg"></i></span></td>');
    });
    $('.buttons').click(function(){
        var key = $($(this).parent().parent()[0]).attr('data-key');
        var type = $(this).attr('data-type');
        var select = $(this).parent().parent().find('td:nth-child(3)').find('select');
        select.val(type);
        $(select).trigger('change');
        window.location.reload(true);
    });
    $('tbody select').each(function(){
       var val = $(this).val();
       if(val == 1){
           $(this).parent().next().next().next().addClass('checked');
       }else if(val == ''){
           $(this).parent().next().next().addClass('checked');
       }
    });
})();