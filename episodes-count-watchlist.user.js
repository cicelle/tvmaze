// ==UserScript==
// @name         Count episodes Watchlist
// @namespace    TVMaze
// @version      1.2
// @description  Reorganize the complete the most|least order. Also change the display
// @author       cicelle
// @match        http://www.tvmaze.com/watchlist*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/episodes-count-watchlist.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>'+
                     '#site-navigation+.row+.row>div{display:flex;flex-direction:column}'+
                     '#site-navigation+.row+.row>div>br,.watchlist-show+hr{display:none}'+
                     '#site-navigation+.row+.row>div>br+div{order:0}'+
                     '#site-navigation+.row+.row>div>div+div{order:1;margin-bottom:20px}'+
                     '.watchlist-show{position:relative}'+
                     '.watchlist-show .watched-eps{width:100px;font-size:14px;line-height:14px;margin-bottom:10px;padding-right:0;text-align:left}'+
                     '.watchlist-show .watched-eps span{float:right}'+
                     '.watchlist-show .progress{position:absolute;top:4px;left:100px;right:60px;width:auto;height:15px;margin-bottom:0}'+
                     '.watch-list+a{position:absolute;top:2px;right:0;font-size:.9em}'+
                     'h2{color:#ccc}'+
                     'h2 a{font-weight:400}'+
                     'h2 a:last-child{font-size:.5em}'+
                     '@media max-width:40em){'+
                     'h2{margin-bottom:30px}'+
                     '.watchlist-show .watched-eps{top:-25px;right:auto;left:0;width:60px;text-align:center}'+
                     '.watchlist-show .progress{top:-27px;width:auto;left:65px}'+
                     '.watch-list+a{top:-25px}'+
                     'h2 a:last-child{font-size:.6em}'+
                     '}'+
                     '</style>');
    var sort = $('[name=sort] :selected').html();
    var tunseen = [], tdate = [], tf = [], t;
    function counter(selector){
        var c = $(selector).html().split(' / ');
        var unseen = parseInt(c[1]) - parseInt(c[0]);
        var percent = ((parseInt(c[0]) / parseInt(c[1]) )*100) + '%';
        $(selector).attr('data-unseen', unseen).append('<span>['+unseen+']</span>');
        $(selector).next().find('.meter').css('width', percent);
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
        var num = 1;
        tf.forEach(function(e){
            $('[data-show_id='+e+']').parent().css({
                'order': num++
            });
        });
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