// ==UserScript==
// @name         Count episodes Watchlist
// @namespace    TVMaze
// @version      1.5.5
// @description  Reorganize the complete the most|least order. Also change the display
// @author       cicelle
// @match        http://www.tvmaze.com/watchlist*
// @match        https://www.tvmaze.com/watchlist*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/episodes-count-watchlist.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    $('head').append('<style>'+
                     '#site-header+div+div>div{display:flex;flex-direction:column}'+
                     '#site-header+div+div>div>br,.watchlist-show+hr{display:none}'+
                     '#site-header+div+div>div>br+div{order:0}'+
                     '#site-header+div+div>div>div+div{order:1}'+
                     '.episode-list{position:relative;margin-bottom:30px}'+
                     '.episode-list .watched-eps{max-width:105px;width:105px;font-size:14px;line-height:14px;margin-bottom:10px;padding-right:0;text-align:left}'+
                     '.episode-list .watched-eps span{float:right}'+
                     '.episode-list .progress{position:absolute;top:3px;left:110px;right:65px;width:auto;height:10px;margin-bottom:0}'+
                     '.season+a.button.negative{position:absolute;top:0px;right:0;font-size:.9em;border:none;padding:0;border-radius:0;}'+
                     'h2{color:#ccc}'+
                     'h2 a{font-weight:400}'+
                     'h2 a:last-child{font-size:.5em}'+
                     '@media screen and (max-width:400px){'+
                     'h2{margin-bottom:30px;}'+
                     '.episode-list .progress{top:-20px;left:0;right: 0;max-width: 100%;}'+
                     'h2 a:last-child{font-size:.6em}'+
                     '}'+
                     '</style>');
    var sort = $('[name=sort] :selected').html();
    var tunseen = [], tdate = [], tf = [], t;
    /**********************
    COUNTER : set unseen count to each show
    **********************/
    function counter(selector){
        var c = $(selector).html().trim().split(' / ');
        var unseen = parseInt(c[1]) - parseInt(c[0]);
        var percent = ((parseInt(c[0]) / parseInt(c[1]) )*100) + '%';
        $(selector).append('<span>['+unseen+']</span>').parent().parent().attr('data-unseen', unseen);
        $(selector).next().find('.progress-meter').css('width', percent);
    }
    /**********************
    DATADATE : set the date of the first episode as an attribute for each show
    **********************/
    function datadate(selector){
        var y = $(selector).find('header + .episode-row > div:nth-child(2)').text().trim().split(', ');
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
    /**********************
    set the order for one show
    **********************/
    function position(){
        var num = 1;
        tf.forEach(function(e){
            $('[data-show_id='+e+']').parent().css({
                'order': num++
            });
        });
    }
    /**********************
    to each show :
    - add 'episode list' link
    - use datadate (set the date of the first episode as an attribute for each show)
    - use counter (set unseen count to each show)
    - build arrays sorted by unseen and date
    **********************/
    $('#filter').nextAll().each(function(){
        $(this).find('h2').append(' | <a href="'+$(this).find('h2 a').attr('href')+'/episodes?all=1">Episodes list</a>');
        datadate( $(this).find('.episode-list') );
        counter( $(this).find('.watched-eps') );
        var id = parseInt($(this).find('.episode-list').attr('data-show_id'));
        var i = parseInt($(this).find('.episode-list').attr('data-unseen'));
        var j = parseInt($(this).find('.episode-list').attr('data-date'));
        if(!tunseen[i])
            tunseen[i] = [];
        tunseen[i].push(id);
        if(!tdate[j])
            tdate[j] = [];
        tdate[j].push(id);
    });
    /**********************
    change the display order to match logical unseen order
    **********************/
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
    /**********************
    create the observer
    **********************/
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var observer = new MutationObserver(function(mutations) {
        var oSelector = $(mutations[0].target).find('.watched-eps');
        var oC = $(oSelector).html().split(' / ');
        var oUnseen = parseInt(oC[1]) - parseInt(oC[0]);
        var oPercent = ((parseInt(oC[0]) / parseInt(oC[1]) )*100) + '%';
        $(oSelector).next().find('.meter').css('width', oPercent);
        if($('[data-unseen]').length != 0){
            $(oSelector).attr('data-unseen', oUnseen).append('<span>['+oUnseen+']</span>');
        }
    });
    /**********************
    add the observers
    **********************/
    for(var j = 0; j < $('.episode-list').length; j++){
        observer.observe($('.episode-list')[j], {
            childList: true
        });
    }
})();