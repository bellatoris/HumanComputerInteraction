$(document).ready(function() {
    $('a').mouseenter(function() {
        $(this).fadeTo('fast', 0.5);
    });
    $('a').mouseleave(function() {
        $(this).fadeTo('fast', 1);
    });
});