/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var currentPage = "auth";
var authApiKey = null;

function trimPage() {
    return "auth";
}

function switchToState(state) {
    $("section").hide();
    $("section[data-state='" + state + "']").show();
}

function throwApiError(errorCode) {
    $("#apiErrorCode").text(errorCode);
    switchToState("apiError");
}

function authContinue() {
    switchToState("loading");

    if (authApiKey != null && authApiKey != "") {
        if (authApiKey.match(/^[a-zA-Z0-9]+$/)) {
            firebase.firestore().collection("apiKeys").doc(authApiKey).get().then(function(keyDocument) {
                if (keyDocument.exists) {
                    window.location.replace("/");
                } else {
                    throwApiError("ERROR_UNKNOWN_KEY");
                }
            });
        } else {
            throwApiError("ERROR_KEY_FORMAT");
        }
    } else {
        throwApiError("ERROR_NO_KEY");
    }
}

function authSignUp() {
    if ($("#signUpEmail").val().trim() != "" && $("#signUpPassword").val().length >= 6) {
        signUp();
    } else if ($("#signUpPassword").val() != "") {
        $("#signUpUsernameError").text(_("Your password must be at least 6 characters long."));
    } else {
        $("#signUpUsernameError").text(_("Please enter your email address and password before continuing."));
    }
}

$(function() {
    authApiKey = core.getURLParameter("key");

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            authContinue();
        } else {
            switchToState("signIn");
        }
    });
});