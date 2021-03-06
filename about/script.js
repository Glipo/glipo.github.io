/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var currentPage = "about";

function trimPage() {
    return "about";
}

function showMenu() {
    $(".menu").show();
    $(".menuToggleDropdownIndicator").text("arrow_drop_up");

    if ($("html").is("[dir='rtl']")) {
        $(".menu").css("right", Math.min($(window).width() - $(".menuAnchor").offset().left - $(".menuAnchor").innerWidth(), $(window).width() - 310) + "px");
    } else {
        $(".menu").css("left", Math.min($(".menuAnchor").offset().left, $(window).width() - 310) + "px");
    }
}

function hideMenu() {
    $(".menu").hide();
    $(".menuToggleDropdownIndicator").text("arrow_drop_down");
}

function toggleMenu() {
    if ($(".menu").is(":visible")) {
        hideMenu();
    } else {
        showMenu();
    }
}