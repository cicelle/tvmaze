// ==UserScript==
// @name         Count episodes Watchlist
// @namespace    TVMaze
// @version      0.2
// @description  Reorganize the complete the most|least order. Also change the display
// @author       cicelle
// @include      http://www.tvmaze.com/watchlist*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/episodes-count-watchlist.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>'+
                     '.watchlist-show{position:relative;margin-bottom:40px}'+
                     '.watchlist-show .watched-eps{position:absolute;top:-35px;right:275px;padding-right:0;font-size:.9em;text-align:right}'+
                     '.watchlist-show .progress{position:absolute;top:-37px;right:65px;width:200px;height:20px}'+
                     '.watch-list+a{position:absolute;top:-35px;right:0;padding-top:3px;font-size:.9em}'+
                     '.watchlist-show+hr{display:none}'+
                     '.watchlist-show h2{font-weight:400}'+
                     '</style>');
    var sort = $('[name=sort] :selected').html();
    var width = $('#filter + div').width() ;
    var top = $('#filter').height() + parseInt($('#filter').css('margin-bottom')) + parseInt($('#filter').css('margin-top'));
    var left = parseInt($('#filter').parent().css('padding-left'));
    var l = $('.watched-eps').length;
    var p = 18;
    t = [];
    tf = [];
    function counter(selector){
        var c = $(selector).html().split(' / ');
        var unseen = parseInt(c[1]) - parseInt(c[0]);
        $(selector).attr('data-unseen', unseen);
    }
    $('.watched-eps').each(function(){
        counter(this);
    });
    if( sort == 'Completed the most' || sort == 'Completed the least' ){
        $('#filter').nextAll().each(function(){
            var n = parseInt($(this).find('.watched-eps').attr('data-unseen'));
            var id = parseInt($(this).find('.watchlist-show').attr('data-show_id'));
            if(!t[n])
                t[n] = [];
            t[n].push(id);
        });
        t.forEach(function(e){
            e.forEach(function(f){
                tf.push(f);
            });
        });
        if(sort == 'Completed the least' )
            tf.reverse();
        tf.forEach(function(e){
            var h = $('[data-show_id='+e+']').outerHeight(true) + $('[data-show_id='+e+']').prev().outerHeight(true) + p;
            $('[data-show_id='+e+']').parent().css({
                'position':'absolute',
                'width' : '100%',
                'left': '0px',
                'padding': '0 '+left+'px',
                'top': (top)+'px'
            });
            top += h;
        });
        $('#filter').parent().css({'height': top+'px', 'position':'relative'});
    }
})();