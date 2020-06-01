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

var currentUser = {
    uid: null,
    username: null
};

var accountRequiresSettingUp = false;

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
    if ($("#signUpEmail").val().trim() != "" && $("#signUpPassword").val().length >= 6) {
        closeDialogs();

        $(".signUpUsernameDialog")[0].showModal();
        $("#signUpUsername").focus();

        $("#signUpError").text("");
    } else if ($("#signUpPassword").val() != "") {
        $("#signUpError").text(_("Your password must be at least 6 characters long."));
    } else {
        $("#signUpError").text(_("Please enter your email address and password before continuing."));
    }
}

function signUp() {
    if ($("#signUpUsername").val().match(/^[a-zA-Z0-9]{1,20}$/) && $("#signUpPassword").val().length >= 6) {
        $("#signUpUsernameButton").prop("disabled", true);

        firebase.firestore().collection("usernames").doc($("#signUpUsername").val().toLowerCase()).get().then(function(document) {
            if (!document.exists) {
                accountRequiresSettingUp = true;

                firebase.auth().createUserWithEmailAndPassword($("#signUpEmail").val().trim(), $("#signUpPassword").val()).catch(function(error) {
                    accountRequiresSettingUp = false;

                    if (error.code == "auth/email-already-in-use") {
                        $("#signUpUsernameError").text(_("There already appears to be an account with that email address. Please try again with a different one."));
                    } else if (error.code == "auth/invalid-email") {
                        $("#signUpUsernameError").text(_("The email you have entered appears to be invalid. Go back, re-enter your email address and try again."));
                    } else {
                        $("#signUpUsernameError").text(_("We ran into a problem when creating your account. Please check your internet connection and try again."));
                    }

                    $("#signUpUsernameButton").prop("disabled", false);
                });
            } else {
                $("#signUpUsernameError").text(_("Sorry, but that username is taken. Try another one!"));

                $("#signUpUsernameButton").prop("disabled", false);
            }
        });
    } else if ($("#signUpUsername").val() == "") {
        $("#signUpUsernameError").text(_("Please enter your username before signing up."));
    } else if ($("#signUpEmail").val().trim() == "" || $("#signUpPassword").val().length < 6) {
        $("#signUpUsernameError").text(_("Please go back and check that your email and password is correct before signing up."));
    } else {
        $("#signUpUsernameError").text(_("Your username must only contain letters and numbers, and cannot exceed 20 characters."));
    }
}

function signIn() {
    if ($("#signInEmail").val().trim() != "" && $("#signInPassword").val() != "") {
        $("#signInButton").prop("disabled", true);

        firebase.auth().signInWithEmailAndPassword($("#signInEmail").val().trim(), $("#signInPassword").val()).then(function() {
            $("#signInButton").prop("disabled", false);

            closeDialogs();

            $("#signInEmail").val("");
            $("#signInPassword").val("");
        }).catch(function(error) {
            if (error.code == "auth/invalid-email") {
                $("#signUpUsernameError").text(_("The email you have entered appears to be invalid. Go back, re-enter your email address and try again."));
            } else if (error.code == "auth/user-not-found") {
                $("#signUpUsernameError").text(_("There appears to be no user with that email address. Did you mean to sign up instead?"));
            } else if (error.code == "auth/wrong-password") {
                $("#signUpUsernameError").text(_("The password that you have entered is wrong and doesn't match this account's password. Try typing it in again."));
            } else {
                $("#signUpUsernameError").text(_("We ran into a problem when signing into your account. Please check your internet connection and try again."));
            }

            $("#signInButton").prop("disabled", false);
        });
    } else {
        $("#signUpError").text(_("Please enter your email address and password to sign in."));
    }
}

function signOut() {
    firebase.auth().signOut();
}

function visitUserProfile() {
    if (currentUser.username != null) {
        window.location.href = "/u/" + currentUser.username;
    }
}

function visitSubmitPost() {
    if (currentUser.uid != null) {
        window.location.href = "/submit";
    } else {
        showSignInDialog();
    }
}

$(function() {
    if (localStorage.getItem("signedInUsername") != null) {
        currentUser.username = localStorage.getItem("signedInUsername");

        $(".currentUsername").text(currentUser.username);

        $(".signedOut").hide();
        $(".signedIn").show();
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser.uid = user.uid;

            if (accountRequiresSettingUp) {
                firebase.firestore().collection("users").doc(currentUser.uid).set({
                    username: $("#signUpUsername").val()
                }).then(function() {
                    firebase.firestore().collection("usernames").doc($("#signUpUsername").val().toLowerCase()).set({
                        uid: currentUser.uid
                    }).then(function() {
                        $("#signUpUsernameButton").prop("disabled", false);

                        closeDialogs();

                        $("#signUpEmail").val("");
                        $("#signUpPassword").val("");
                        $("#signUpUsername").val("");
                    });
                });

                currentUser.username = $("#signUpUsername").val();

                $(".currentUsername").text(currentUser.username);
                localStorage.setItem("signedInUsername", currentUser.username);

                accountRequiresSettingUp = false;
            } else {
                firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(document) {
                    currentUser.username = document.data().username;

                    $(".currentUsername").text(currentUser.username);
                    localStorage.setItem("signedInUsername", currentUser.username);
                });
            }

            $(".signedOut").hide();
            $(".signedIn").show();
        } else {
            currentUser.uid = null;
            currentUser.username = null;

            $(".signedIn").hide();
            $(".signedOut").show();

            $(".currentUsername").text("");
            localStorage.removeItem("signedInUsername");
        }
    });

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

    $("#signInPassword").keypress(function(event) {
        if (event.keyCode == 13) {
            signIn();
        }
    });

    $("#signUpPassword").keypress(function(event) {
        if (event.keyCode == 13) {
            switchToSignUpUsernameDialog();
        }
    });

    $("#signUpUsername").keypress(function(event) {
        if (event.keyCode == 13) {
            signUp();
        }
    });
});