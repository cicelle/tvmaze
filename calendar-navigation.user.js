// ==UserScript==
// @name         Calendar navigation
// @namespace    TVMaze
// @version      1.1
// @description  Navigation buttons
// @author       cicelle
// @include      http://www.tvmaze.com/calendar*
// @include      https://www.tvmaze.com/calendar*
// @downloadURL  https://raw.githubusercontent.com/cicelle/tvmaze/master/calendar-navigation.user.js
// @license      The MIT License (MIT)
// ==/UserScript==
(function() {
    'use strict';
    $('head').append(`<style>
		.calendar{margin-bottom: 0}
		#calendar-footer{background-color: #ebebeb; padding: 0.5rem 0;}
		#calendar-footer #month{font-size: 1.3rem;font-family: open sans,sans-serif;font-weight: 300}
		</style>`);

    /****************************
    add another calendar navigation
    *****************************/
    if($('#calendar-header').length){
        let calfooter = '<article id="calendar-footer" class="grid-x align-middle align-center">'+$('#calendar-header').html()+'</article>';
        $('#calendar-wrap .card').append(calfooter)
    }
})();
