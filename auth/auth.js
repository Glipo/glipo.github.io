/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var currentPage = "auth";

function trimPage() {
    return "auth";
}

function switchToState(state) {
    $("section").hide();
    $("section[data-state='" + state + "']").show();
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // TODO: Continue to destination if key is provided, if not, ask for perms
        } else {
            switchToState("signIn");
        }
    });
});