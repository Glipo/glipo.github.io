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
                    firebase.firestore().collection("users").doc(currentUser.uid).collection("apiGrants").doc(authApiKey).get().then(function(keyGrantDocument) {
                        if (keyGrantDocument.exists) {
                            if (keyDocument.data().redirect.startsWith("/") || keyDocument.data().redirect.startsWith("http://") || keyDocument.data().redirect.startsWith("https://")) {
                                window.location.replace(keyDocument.data().redirect.replace(/{uid}/g, currentUser.uid));
                            } else {
                                throwApiError("ERROR_INVALID_REDIRECT");
                            }
                        } else {
                            $("#grantPermissionsHeader").text(_("Allow {0} to connect to your Glipo Account?", [keyDocument.data().displayName[lang.language] || keyDocument.data().displayName["default"]]));
                            $("#grantPermissionsList").html("");

                            var requestedPermissions = keyDocument.data().permissions || [];

                            $("#grantPermissionsList").append(
                                $("<details>").append([
                                    $("<summary>").text(_("View your profile information")),
                                    $("<p>").text(_("This service will be able to see your username, bio, points, posts and comments."))
                                ])
                            );

                            if (requestedPermissions.indexOf("basic") > -1) {
                                $("#grantPermissionsList").append(
                                    $("<details>").append([
                                        $("<summary>").text(_("Perform basic interaction on Glipo")),
                                        $("<p>").text(_("This service will be able to upvote and downvote posts and comments, as well as join and leave groups. This service can also report posts and comments on your behalf."))
                                    ])
                                );
                            }

                            if (requestedPermissions.indexOf("submit") > -1) {
                                $("#grantPermissionsList").append(
                                    $("<details>").append([
                                        $("<summary>").text(_("Submit posts and comments on your behalf")),
                                        $("<p>").text(_("This service will be able to submit posts and comments to Glipo from your account at any time."))
                                    ])
                                );
                            }

                            if (requestedPermissions.indexOf("settings") > -1) {
                                $("#grantPermissionsList").append(
                                    $("<details>").append([
                                        $("<summary>").text(_("Edit your account settings")),
                                        $("<p>").text(_("This service will be able to modify the casing of your username and change any other settings on your Glipo Account. This service cannot change your password."))
                                    ])
                                );
                            }

                            if (requestedPermissions.indexOf("moderation") > -1) {
                                $("#grantPermissionsList").append(
                                    $("<details>").append([
                                        $("<summary>").text(_("Moderate groups that you are part of")),
                                        $("<p>").text(_("This service will be able to access all moderation tools for groups that you're a moderator in. If you're a group owner, this service will be able to modify group settings."))
                                    ])
                                );
                            }

                            switchToState("grantPermissions");
                        }
                    });
                } else {
                    throwApiError("ERROR_UNKNOWN_KEY");
                }
            });
        } else {
            throwApiError("ERROR_KEY_FORMAT");
        }
    } else if (core.getURLParameter("go") != null) {
        if (core.getURLParameter("go").startsWith("/") || core.getURLParameter("go").startsWith("http://") || core.getURLParameter("go").startsWith("https://")) {
            window.location.replace(core.getURLParameter("go"));
        } else {
            throwApiError("ERROR_INVALID_REDIRECT");
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

function authGrantPermissions() {
    switchToState("loading");

    api.grantApiPermission({
        key: authApiKey
    }).then(function() {
        authContinue();
    }).catch(function(error) {
        console.error("Glipo backend error:", error);

        throwApiError("ERROR_INTERNAL");
    });
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