// ==UserScript==
// @name         Count episodes Watchlist
// @namespace    TVMaze
// @version      0.3
// @description  Reorganize the complete the most|least order. Also change the display
// @author       cicelle
// @include      http://www.tvmaze.com/watchlist*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/episodes-count-watchlist.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>'+
                     '.watchlist-show{position:relative;margin-bottom:40px}'+
                     '.watchlist-show .watched-eps{position:absolute;top:-30px;right:275px;padding-right:0;font-size:.9em;text-align:right}'+
                     '.watchlist-show .progress{position:absolute;top:-31px;right:65px;width:200px;height:20px}'+
                     '.watch-list+a{position:absolute;top:-30px;right:0;padding-top:3px;font-size:.9em}'+
                     '.watchlist-show+hr{display:none}'+
                     'h2{color:#ccc;}'+
                     'h2 a{font-weight:400;}'+
                     'h2 a:last-child{font-size:0.5em}'+
                     '@media(max-width:40em){'+
                     'h2{margin-bottom:30px;}'+
                     '.watchlist-show .watched-eps{top:-25px;right:auto;left:0;width:60px;text-align:center;}'+
                     '.watchlist-show .progress{top:-27px;width:auto;left:65px;}'+
                     '.watch-list+a{top:-25px;}'+
                     'h2 a:last-child{font-size:0.6em}'+
                     '}'+
                     '</style>');
    var sort = $('[name=sort] :selected').html();
    var width = $('#filter + div').width() ;
    var top = $('#filter').height() + parseInt($('#filter').css('margin-bottom')) + parseInt($('#filter').css('margin-top'));
    var left = parseInt($('#filter').parent().css('padding-left'));
    var l = $('.watched-eps').length;
    var p = 18, tunseen = [], tdate = [], tf = [], t;
    function counter(selector){
        var c = $(selector).html().split(' / ');
        var unseen = parseInt(c[1]) - parseInt(c[0]);
        $(selector).attr('data-unseen', unseen);
    }
    function datadate(selector){
        var y = $(selector).find('tbody tr:first-child td:nth-child(2)').text().split(', ');
        var m = y[0].split(' ');
        var d = parseInt(m[1]);
        if(d<10)
            d = '0'+d;
        var monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        m = monthLabel.indexOf(m[0]);
        if(m<10)
            m = '0'+m;
        $(selector).attr('data-date', y[1]+m+d);
    }
    function position(){
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
    $('#filter').nextAll().each(function(){
        $(this).find('h2').append(' | <a href="'+$(this).find('h2 a').attr('href')+'/episodes?all=1">Episodes list</a>');
        datadate( $(this).find('table') );
        counter( $(this).find('.watched-eps') );
        var id = parseInt($(this).find('.watchlist-show').attr('data-show_id'));
        var i = parseInt($(this).find('.watched-eps').attr('data-unseen'));
        var j = parseInt($(this).find('table').attr('data-date'));
        if(!tunseen[i])
            tunseen[i] = [];
        tunseen[i].push(id);
        if(!tdate[j])
            tdate[j] = [];
        tdate[j].push(id);
    });
    if( sort == 'Completed the most' || sort == 'Completed the least' || sort == 'Aired least recently' || sort == 'Aired most recently'){
        if (sort == 'Completed the most' || sort == 'Completed the least')
            t = tunseen;
        else
            t = tdate;
        t.forEach(function(e){
            e.forEach(function(f){
                tf.push(f);
            });
        });
        if(sort == 'Completed the least' || sort == 'Aired most recently' )
            tf.reverse();
        position();
    }
})();