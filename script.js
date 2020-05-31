/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var firebaseConfig = {
    apiKey: "AIzaSyBxs_F52qiFI85ZbFQ7ysIrvBhKDEvutuw",
    authDomain: "glipo-net.firebaseapp.com",
    databaseURL: "https://glipo-net.firebaseio.com",
    projectId: "glipo-net",
    storageBucket: "glipo-net.appspot.com",
    messagingSenderId: "991734469429",
    appId: "1:991734469429:web:93a3a72653c3921831f27c",
    measurementId: "G-MGPY4PE9JH"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

function showMenu() {
    $(".menu").show();
    $(".locationDropdownIndicator").text("arrow_drop_up");
}

function hideMenu() {
    $(".menu").hide();
    $(".locationDropdownIndicator").text("arrow_drop_down");
}

function toggleMenu() {
    if ($(".menu").is(":visible")) {
        hideMenu();
    } else {
        showMenu();
    }
}

function closeDialogs() {
    for (var i = 0; i < $("dialog").length; i++) {
        $("dialog")[i].close();
    }
}

function showSignInDialog() {
    $(".signInDialog")[0].showModal();
    $("#signInEmail").focus();
}

function switchToSignInDialog() {
    closeDialogs();
    showSignInDialog();
}

function showSignUpDialog() {
    $(".signUpDialog")[0].showModal();
    $("#signUpEmail").focus();
}

function switchToSignUpDialog() {
    closeDialogs();
    showSignUpDialog();
}

function switchToSignUpUsernameDialog() {
    if ($("#signUpEmail").val().trim() != "" && $("#signUpPassword").val() != "") {
        closeDialogs();

        $(".signUpUsernameDialog")[0].showModal();
        $("#signUpUsername").focus();

        $("#signUpError").text("");
    } else {
        $("#signUpError").text(_("Please enter your email address and password before continuing."));
    }
}

$(function() {
    $("html").mouseup(function(event) {
        if (!$(".location, .menuButton").is(event.target) && $(".location, .menuButton").has(event.target).length == 0) {
            hideMenu();
        }
    });
    
    $("body").on("mousedown", "*", function(event) {
        if (($(this).is(":focus") || $(this).is(event.target)) && $(this).css("outline-style") == "none") {
            $(this).css("outline", "none").on("blur", function() {
                $(this).off("blur").css("outline", "");
            });
        }
    });
});