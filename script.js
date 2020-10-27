/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

const RE_IMAGE = /.*(\.png|\.jpg|\.jpeg|\.gif|\.PNG|\.JPG|\.JPEG|\.GIF)/;
const RE_GLIPO_CROSSPOST = /https:\/\/glipo\.net\/g\/(.*)\/posts\/(.*)/;
const RE_IMGUR = /https:\/\/imgur\.com\/gallery\/(.*)/;
const RE_YOUTUBE = /(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([a-zA-Z0-9_-]{1,64})/;
const RE_GIPHY = /https:\/\/giphy\.com\/gifs\/(.*)/;
const RE_GFYCAT = /https:\/\/gfycat\.com\/(.*)/;
const HIDDEN_COMMENT_REVEAL_FIRST = 10;
const HIDDEN_COMMENT_REVEAL_INTERVAL = 10;
const HIDDEN_REPLY_REVEAL_FIRST = 5;
const HIDDEN_REPLY_REVEAL_DEPTH = 2;

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

var currentUser = {
    uid: null,
    username: null
};

firebase.initializeApp(firebaseConfig);

if ("analytics" in firebase) {
    firebase.analytics();
}

var cloudMessaging;

try {
    cloudMessaging = firebase.messaging();

    cloudMessaging.usePublicVapidKey("BCnBejAKa0014JB3f0ySA7zcvQ4TJ7sm3rWjIUiTf3haviaOAZD5lj_BXfB7uSp-R5KXLHc5Snvz1GU8zp6kZPE");
} catch (e) {}

var groupNameSettleTimeout;
var deleteAccountActiveFromSettings = false;

function timeDifferenceToHumanReadable(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var years = Math.floor(days / 365);

    if (years > 0) {
        return _("{0} years ago", [years]);
    } else if (weeks > 0) {
        return _("{0} weeks ago", [weeks]);
    } else if (days > 0) {
        return _("{0} days ago", [days]);
    } else if (hours > 0) {
        return _("{0} hours ago", [hours]);
    } else if (minutes > 0) {
        return _("{0} minutes ago", [minutes]);
    } else if (seconds > 0) {
        return _("{0} seconds ago", [seconds]);
    } else {
        return _("Literally just now");
    }
}

function simpleTimeDifferenceToHumanReadable(milliseconds) {
    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var weeks = Math.floor(days / 7);
    var years = Math.floor(days / 365);

    if (years > 0) {
        return _("{0} years", [years]);
    } else if (weeks > 0) {
        return _("{0} weeks", [weeks]);
    } else if (days > 0) {
        return _("{0} days", [days]);
    } else if (hours > 0) {
        return _("{0} hours", [hours]);
    } else if (minutes > 0) {
        return _("{0} minutes", [minutes]);
    } else if (seconds > 0) {
        return _("{0} seconds", [seconds]);
    } else {
        return _("Now");
    }
}

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
    $("dialog").each(function() {
        try {
            this.close();
        } catch (e) {}

        $(this).attr("open", null);
    });
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
    if ($("#signUpUsername").val().match(/^[a-zA-Z0-9]{3,20}$/) && $("#signUpPassword").val().length >= 6) {
        $("#signUpUsernameButton").prop("disabled", true);
        $("#signUpUsernameButton").text(_("Signing up..."));

        firebase.firestore().collection("usernames").doc($("#signUpUsername").val().toLowerCase()).get().then(function(document) {
            if (!document.exists) {
                firebase.auth().createUserWithEmailAndPassword($("#signUpEmail").val().trim(), $("#signUpPassword").val()).catch(function(error) {
                    if (error.code == "auth/email-already-in-use") {
                        $("#signUpUsernameError").text(_("There already appears to be an account with that email address. Did you mean to sign in instead?"));
                    } else if (error.code == "auth/invalid-email") {
                        $("#signUpUsernameError").text(_("The email you have entered appears to be invalid. Go back, re-enter your email address and try again."));
                    } else {
                        $("#signUpUsernameError").text(_("We ran into a problem when creating your account. Please check your internet connection and try again."));
                    }

                    $("#signUpUsernameButton").prop("disabled", false);
                    $("#signUpUsernameButton").text(_("Sign up"));
                });
            } else {
                $("#signUpUsernameError").text(_("Sorry, but that username is taken. Try another one!"));

                $("#signUpUsernameButton").prop("disabled", false);
                $("#signUpUsernameButton").text(_("Sign up"));
            }
        });
    } else if ($("#signUpUsername").val() == "") {
        $("#signUpUsernameError").text(_("Please enter your username before signing up."));
    } else if ($("#signUpEmail").val().trim() == "" || $("#signUpPassword").val().length < 6) {
        $("#signUpUsernameError").text(_("Please go back and check that your email and password is correct before signing up."));
    } else {
        $("#signUpUsernameError").text(_("Your username must only contain letters and numbers, and must be between 3-20 characters long."));
    }
}

function signIn() {
    if ($("#signInEmail").val().trim() != "" && $("#signInPassword").val() != "") {
        $("#signInButton").prop("disabled", true);
        $("#signInButton").text(_("Signing in..."));

        firebase.auth().signInWithEmailAndPassword($("#signInEmail").val().trim(), $("#signInPassword").val()).then(function() {
            $("#signInButton").prop("disabled", false);
            $("#signInButton").text(_("Sign in"));

            closeDialogs();

            $("#signInEmail").val("");
            $("#signInPassword").val("");
        }).catch(function(error) {
            if (error.code == "auth/invalid-email") {
                $("#signInError").text(_("The email you have entered appears to be invalid. Go back, re-enter your email address and try again."));
            } else if (error.code == "auth/user-not-found") {
                $("#signInError").text(_("There appears to be no user with that email address. Did you mean to sign up instead?"));
            } else if (error.code == "auth/wrong-password") {
                $("#signInError").text(_("The password that you have entered is wrong and doesn't match this account's password. Try typing it in again."));
            } else {
                $("#signInError").text(_("We ran into a problem when signing into your account. Please check your internet connection and try again."));
            }

            $("#signInButton").prop("disabled", false);
            $("#signInButton").text(_("Sign in"));
        });
    } else {
        $("#signInError").text(_("Please enter your email address and password to sign in."));
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
        checkBanStatePage(function() {
            if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
                var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    
                window.location.href = "/submit?group=" + encodeURIComponent(groupName);
            } else {
                window.location.href = "/submit";
            }
        });
    } else {
        showSignUpDialog();
    }
}

function visitCreateGroup() {
    if (currentUser.uid != null) {
        checkBanStatePage(function() {
            if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
                var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    
                window.location.href = "/creategroup?group=" + encodeURIComponent(groupName);
            } else {
                window.location.href = "/creategroup";
            }
        });
    } else {
        showSignUpDialog();
    }
}

function leaveGroup() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        if (currentUser.uid != null) {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

            api.leaveGroup({group: groupName});

            $(".groupJoinButton").text(_("Join"));
            $(".groupJoinButton").addClass("blue");

            firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                $(".groupMemberCount").text(_("{0} members", [groupDocument.data().memberCount - 1]));
            });
        } else {
            throw "Not authenticated";
        }
    } else {
        throw "Not on group page";
    }

    closeDialogs();
}

function showLeaveGroupDialog() {
    $(".leaveGroupDialog")[0].showModal();
}

function toggleGroupMembership() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        if (currentUser.uid != null) {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

            firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").doc(groupName).get().then(function(userMembershipDocument) {
                if (userMembershipDocument.exists) {
                    showLeaveGroupDialog();
                } else {
                    api.joinGroup({group: groupName});

                    $(".groupJoinButton").text(_("Leave"));
                    $(".groupJoinButton").removeClass("blue");

                    firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                        $(".groupMemberCount").text(_("{0} members", [groupDocument.data().memberCount + 1]));
                    });
                }
            });
        } else {
            showSignUpDialog();
        }
    } else {
        throw "Not on group page";
    }
}

function checkBanStatePage(callback = function() {}) {
    firebase.firestore().collection("users").doc(currentUser.uid).collection("auth").doc("banInfo").get().then(function(banInfoDocument) {
        if (!banInfoDocument.exists) {
            callback();

            return;
        }

        if (!!banInfoDocument.data().bannedForever) {
            window.location.href = "/banned?forever=true";

            return;
        }

        if (banInfoDocument.data().bannedUntil != null && new Date().getTime() < banInfoDocument.data().bannedUntil.toDate().getTime()) {
            window.location.href = "/banned?until=" + encodeURIComponent(banInfoDocument.data().bannedUntil.toDate().getTime());

            return;
        }

        callback();
    });
}

function checkGroupBanState(group, callback = function() {}, error = function() {}) {
    firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
        if (userDocument.data().staff) {
            callback();

            return;
        } else {
            firebase.firestore().collection("groups").doc(group.toLowerCase()).collection("bans").doc(currentUser.uid).get().then(function(banInfoDocument) {
                if (!banInfoDocument.exists) {
                    callback();
        
                    return;
                }
        
                if (!!banInfoDocument.data().bannedForever) {
                    error(_("You cannot perform this action because you're permanently banned from {0}.", [group]));
        
                    return;
                }
        
                if (banInfoDocument.data().bannedUntil != null && new Date().getTime() < banInfoDocument.data().bannedUntil.toDate().getTime()) {
                    var timeDifference = banInfoDocument.data().bannedUntil.toDate().getTime() - new Date().getTime();

                    error(_("You cannot perform this action because you're currently banned from {0}. Your ban will be lifted in {1}.", [group, simpleTimeDifferenceToHumanReadable(timeDifference)]));
        
                    return;
                }
        
                callback();
            });
        }
    });
}

function submitPost() {
    var submitGroup = $("#submitGroup").val().trim().toLowerCase();
    var submitTitle = "";
    var submitType = "";
    var submitContent = "";

    if (submitGroup == "") {
        $("#submitError").text(_("Please enter the name of the group to post to."));
        
        return;
    }

    if (submitGroup.startsWith("g/")) {
        submitGroup = submitGroup.split("/")[1].trim();
    }

    firebase.firestore().collection("groups").doc(submitGroup).get().then(function(groupDocument) {
        if (groupDocument.exists) {
            if (!submitGroup.match(/^[a-zA-Z0-9]{3,20}$/)) {
                $("#submitError").text(_("Please check to see if the group name is correct before posting."));
                
                return;
            }
        
            if ($("#submitType [data-tab='writeup']").is(":visible")) {
                submitTitle = $("#submitWriteupTitle").val().trim();
                submitType = "writeup";
                submitContent = $("#submitWriteupContent textarea").val();
            } else if ($("#submitType [data-tab='media']").is(":visible")) {
                submitTitle = $("#submitMediaTitle").val().trim();
                submitType = "media";
            } else if ($("#submitType [data-tab='link']").is(":visible")) {
                submitTitle = $("#submitLinkTitle").val().trim();
                submitType = "link";
                submitContent = $("#submitLinkUrl").val();
            }
        
            if (submitTitle.trim() == "") {
                $("#submitError").text(_("Please enter the post title."));
        
                return;
            }
        
            if (submitTitle.length > 200) {
                $("#submitError").text(_("Your post title is too long! Please shorten it so that it's at most 200 characters long."));
        
                return;
            }
        
            if (submitType == "writeup") {
                if (submitContent.length > 20000) {
                    $("#submitError").text(_("Your post is too long! Please shorten it so that it's at most 20,000 characters long. You may want to split your post up into multiple parts."));
        
                    return;
                }
        
                $(".submitButton").prop("disabled", true);
                $(".submitButton").text(_("Submitting..."));
        
                checkGroupBanState(submitGroup, function() {
                    api.submitPost({
                        group: submitGroup,
                        title: submitTitle.trim(),
                        content: submitContent,
                        type: "writeup"
                    }).then(function(postId) {
                        window.location.href = "/g/" + submitGroup + "/posts/" + postId.data;
                    }).catch(function(error) {
                        console.error("Glipo backend error:", error);
            
                        $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again later."));
                        $(".submitButton").prop("disabled", false);
                        $(".submitButton").text(_("Submit"));
                    });
                }, function(message) {
                    $("#submitError").html(message);
                    $(".submitButton").prop("disabled", false);
                    $(".submitButton").text(_("Submit"));
                });
            } else if (submitType == "media") {
                if ($("#submitMediaUpload input[type='file']").val() == null || $("#submitMediaUpload input[type='file']").val() == "") {
                    $("#submitError").text(_("Please upload the media you wish to submit."));
        
                    return;
                }

                if (!RE_IMAGE.test($("#submitMediaUpload input[type='file']").val())) {
                    $("#submitError").text(_("Sorry, we don't support the media type that you have uploaded."));
                }

                if ($("#submitMediaUpload input[type='file']")[0].files[0].size > 5 * 1024 * 1024) {
                    $("#submitError").text(_("Sorry, media must be at most 5 MB in size. Try compressing your media and reuploading it."));
                }

                $(".submitButton").prop("disabled", true);
                $(".submitButton").text(_("Uploading..."));

                checkGroupBanState(submitGroup, function() {
                    firebase.storage().ref(
                        "media/" +
                        core.generateKey(32) +
                        "." +
                        $("#submitMediaUpload input[type='file']").val().split(".")[$("#submitMediaUpload input[type='file']"
                    ).val().split(".").length - 1].trim()).put($("#submitMediaUpload input[type='file']")[0].files[0]).then(function(snapshot) {
                        snapshot.ref.getDownloadURL().then(function(url) {
                            $(".submitButton").prop("disabled", true);
                            $(".submitButton").text(_("Submitting..."));
                            
                            api.submitPost({
                                group: submitGroup,
                                title: submitTitle.trim(),
                                content: url,
                                type: "link"
                            }).then(function(postId) {
                                window.location.href = "/g/" + submitGroup + "/posts/" + postId.data;
                            }).catch(function(error) {
                                console.error("Glipo backend error:", error);
            
                                $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again."));
                                $(".submitButton").prop("disabled", false);
                                $(".submitButton").text(_("Submit"));
                            });
                        }).catch(function(error) {
                            console.error("Glipo backend error:", error);
        
                            $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again."));
                            $(".submitButton").prop("disabled", false);
                            $(".submitButton").text(_("Submit"));
                        });
                    });
                }, function(message) {
                    $("#submitError").html(message);
                    $(".submitButton").prop("disabled", false);
                    $(".submitButton").text(_("Submit"));
                });
            } else if (submitType == "link") {
                if (submitContent.trim() == "") {
                    $("#submitError").text(_("Please insert your link to submit this post."));
        
                    return;
                }
        
                if (submitContent.length > 2000) {
                    $("#submitError").text(_("Your link is too long! Shorten your link so it's at most 2,000 characters long. You can use a link shortening service to do this."));
        
                    return;
                }
        
                if (!(submitContent.trim().startsWith("http://") || submitContent.trim().startsWith("https://"))) {
                    $("#submitError").text(_("Make sure that the URL starts with http:// or https:// to submit this post."));
        
                    return;
                }
        
                $(".submitButton").prop("disabled", true);
                $(".submitButton").text(_("Submitting..."));
        
                if (submitContent.trim().match(RE_GLIPO_CROSSPOST)) {
                    var originalGroup = submitContent.trim().match(RE_GLIPO_CROSSPOST)[1];
                    var originalPost = submitContent.trim().match(RE_GLIPO_CROSSPOST)[2];

                    if (submitGroup == originalGroup.toLowerCase()) {
                        $("#submitError").text(_("The group that you're crossposting to is the same as the original post's group. Please choose a different group."));

                        $(".submitButton").prop("disabled", false);
                        $(".submitButton").text(_("Submit"));        

                        return;
                    }

                    checkGroupBanState(submitGroup, function() {
                        api.submitCrosspost({
                            group: submitGroup,
                            title: submitTitle.trim(),
                            originalGroup: originalGroup,
                            originalPost: originalPost
                        }).then(function(postId) {
                            window.location.href = "/g/" + submitGroup + "/posts/" + postId.data;
                        }).catch(function(error) {
                            console.error("Glipo backend error:", error);
                
                            $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again."));
                            $(".submitButton").prop("disabled", false);
                            $(".submitButton").text(_("Submit"));
                        });
                    }, function(message) {
                        $("#submitError").html(message);
                        $(".submitButton").prop("disabled", false);
                        $(".submitButton").text(_("Submit"));
                    });
                }
            }
        } else {
            $("#submitError").text(_("The group you entered doesn't exist! Check the group name and try again."));
        }
    });
}

function triggerCrosspost(group, post, title) {
    window.location.href =
        "/submit?title=" + encodeURIComponent(title) +
        "&url=" + encodeURIComponent("https://glipo.net/g/" + encodeURIComponent(group) + "/posts/" + encodeURIComponent(post))
    ;
}

function visitUserMessages() {
    if (currentPage.startsWith("u/") && trimPage(currentPage).split("/").length > 1) {
        var userProfileUsername = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        window.location.href = "/dm?user=" + encodeURIComponent(userProfileUsername);
    }
}

function checkCreateGroupDetails() {
    var newGroupName = $("#createGroupNameInput").val().trim();

    clearTimeout(groupNameSettleTimeout);

    if (!newGroupName.match(/^[a-zA-Z0-9]*$/)) {
        $(".createGroupNamePrompt").addClass("errorMessage");
        $(".createGroupNamePrompt").text(_("The group name must only contain lowercase and uppercase letters as well as numbers."));
    } else if (newGroupName.length < 3) {
        $(".createGroupNamePrompt").removeClass("errorMessage");
        $(".createGroupNamePrompt").text(_("The group name must be between 3-20 characters long, and must only contain lowercase and uppercase letters as well as numbers."));
    } else if (newGroupName.length > 20) {
        $(".createGroupNamePrompt").addClass("errorMessage");
        $(".createGroupNamePrompt").text(_("The group name cannot be longer than 20 characters."));
    } else {
        $(".createGroupNamePrompt").removeClass("errorMessage");
        $(".createGroupNamePrompt").html(_("Checking to see if that group name is taken..."));


        groupNameSettleTimeout = setTimeout(function() {
            firebase.firestore().collection("groups").doc(newGroupName).get().then(function(groupDocument) {
                if (!groupDocument.exists) {
                    $(".createGroupNamePrompt").removeClass("errorMessage");
                    $(".createGroupNamePrompt").html(_("Good name! Others will be able to join your group by visiting {0}.", [newGroupName]));
                } else {
                    $(".createGroupNamePrompt").addClass("errorMessage");
                    $(".createGroupNamePrompt").text(_("Sorry, a group with that name already exists. Try a different name!"));
                }
            });
        }, 1000);
    }
}

function createGroup() {
    var newGroupName = $("#createGroupNameInput").val().trim();
    var newGroupDescription = $("#createGroupDescriptionInput").val().trim();

    if (newGroupName.match(/^[a-zA-Z0-9]{3,20}$/) && newGroupDescription != "" && newGroupDescription.length <= 200) {
        $("#createGroupButton").prop("disabled", true);
        $("#createGroupButton").text(_("Creating group..."));
            
        firebase.firestore().collection("groups").doc(newGroupName).get().then(function(groupDocument) {
            if (!groupDocument.exists) {
                api.createGroup({
                    groupName: newGroupName,
                    groupDescription: newGroupDescription
                }).then(function() {
                    window.location.href = "/g/" + newGroupName;
                }).catch(function(error) {
                    console.error("Glipo backend error:", error);
                
                    $(".createGroupError").text(_("Sorry, an internal error has occurred. Please try again later."));

                    $("#createGroupButton").prop("disabled", false);
                    $("#createGroupButton").text(_("Create group"));
                });
            } else {
                $(".createGroupNamePrompt").addClass("errorMessage");
                $(".createGroupNamePrompt").text(_("Sorry, a group with that name already exists. Try a different name!"));

                $(".createGroupError").text(_("Please check that you have fulfilled the requirements of the fields above, then try again."));

                $("#createGroupButton").prop("disabled", false);
                $("#createGroupButton").text(_("Create group"));
            }
        });
    } else {
        $(".createGroupError").text(_("Please check that you have fulfilled the requirements of the fields above, then try again."));
    }
}

function visitModeratorTools() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    window.location.href = "/g/" + groupName + "/modtools";
}

function submitAppeal() {
    if (currentUser.uid != null) {
        if ($("#appealSubmitReason").val().trim() == "") {
            $("#appealSubmitError").text(_("Please enter the reason as to why you wish to appeal your ban."));

            return;
        }

        if (!$("#appealAccept").is(":checked")) {
            $("#appealSubmitError").text(_("Please check the promise checkbox to submit your ban appeal."));

            return;
        }

        if ($("#appealSubmitReason").val().length > 5000) {
            $("#appealSubmitError").text(_("Your appeal reason is too long! Please shorten it so that it's at most 5,000 characters long."));

            return;
        }

        $(".appealSubmitButton").prop("disabled", true);
        $(".appealSubmitButton").text(_("Submitting..."));

        api.submitAppeal({
            reason: $("#appealSubmitReason").val()
        }).then(function() {
            $(".appealSubmitButton").text(_("Submitted!"));
        }).catch(function(error) {
            console.error("Glipo backend error:", error);

            $("#appealSubmitError").text(_("Sorry, an internal error has occurred. Please try submitting your appeal again later."));
            $(".appealSubmitButton").prop("disabled", false);
            $(".appealSubmitButton").text(_("Submit"));
        });
    } else {
        $("#appealSubmitError").text(_("Please sign in to submit your appeal."));
    }
}

function savePropertyType(elementClass, pushedButtonNewState = null) {
    var pushedButton = $();
    var previousButtonText = null;

    if ($(document.activeElement).is("button")) {
        pushedButton = $(document.activeElement);
        previousButtonText = pushedButton.text();
    }

    var changes = {};

    $("." + elementClass).each(function() {
        changes[$(this).attr("data-property")] = $(this).val();
    });

    if (elementClass == "settingsPersonalProperty") {
        if (changes.username.toLowerCase() != currentUser.username.toLowerCase()) {
            $("#settingsProfileError").text(_("Sorry, your new username must be the same as your old username, excluding casing changes."));

            return;
        }
    }

    pushedButton.prop("disabled", true);
    pushedButton.text(pushedButtonNewState);

    api.saveSettings({
        type: {"settingsPersonalProperty": "personal"}[elementClass],
        changes: changes
    }).then(function() {
        pushedButton.prop("disabled", false);
        pushedButton.text(previousButtonText);
    }).catch(function(error) {
        console.error("Glipo backend error:", error);

        pushedButton.prop("disabled", false);
        pushedButton.text(_("Error!"));
    });
}

function changePassword() {
    if ($("#settingsCurrentPassword").val().trim() != "" && $("#settingsNewPassword").val().length >= 6) {
        $("#changePasswordButton").prop("disabled", true);
        $("#changePasswordButton").text(_("Changing password..."));

        firebase.auth().currentUser.reauthenticateWithCredential(
            firebase.auth.EmailAuthProvider.credential(
                firebase.auth().currentUser.email,
                $("#settingsCurrentPassword").val()
            )
        ).then(function() {
            firebase.auth().currentUser.updatePassword($("#settingsNewPassword").val()).then(function() {
                $("#changePasswordButton").prop("disabled", false);
                $("#changePasswordButton").text(_("Change password"));
                $("#changePasswordError").text("");

                $("#settingsCurrentPassword").val("");
                $("#settingsNewPassword").val("");
            }).catch(function(error) {
                console.error("Glipo auth error:", error);

                $("#changePasswordButton").prop("disabled", false);
                $("#changePasswordButton").text(_("Change password"));
                $("#changePasswordError").text(_("Sorry, an internal error has occurred. Please try changing your password again later."));
            });
        }).catch(function(error) {
            if (error.code == "auth/invalid-email") {
                console.error("Glipo auth error: Email address cannot be found");

                $("#changePasswordError").text(_("Sorry, an internal error has occurred. Please try changing your password again later."));
            } else if (error.code == "auth/user-not-found") {
                console.error("Glipo auth error: User cannot be found");

                $("#changePasswordError").text(_("Sorry, an internal error has occurred. Please try changing your password again later."));
            } else if (error.code == "auth/wrong-password") {
                $("#changePasswordError").text(_("The current password that you have entered is wrong and doesn't match this account's password. Try typing it in again."));
            } else {
                console.error("Glipo auth error:", error);

                $("#changePasswordError").text(_("We ran into a problem when signing into your account. Please check your internet connection and try again."));
            }

            $("#changePasswordButton").prop("disabled", false);
            $("#changePasswordButton").text(_("Change password"));
        });
    } else if ($("#settingsCurrentPassword").val() != "") {
        $("#changePasswordError").text(_("Your new password must be at least 6 characters long."));
    } else {
        $("#changePasswordError").text(_("Please enter your current password to change it."));
    }
}

function deleteAccount() {
    if (deleteAccountActiveFromSettings) {
        $(".deleteAccountButton").prop("disabled", true);
        $(".deleteAccountButton").text(_("Deleting... 😭"));
        
        api.deleteAccount({
            iKnowTheConsequences: "DELETE MY ACCOUNT NOW!"
        }).then(function() {
            signOut();

            window.location.replace("/");
        });
    } else {
        throw "Your account was saved from being deleted! Next time, don't copy and paste random scripts into the console without knowing what they do.";
    }
}

function showDeleteAccountDialog() {
    deleteAccountActiveFromSettings = true;
    
    $(".deleteAccountDialog")[0].showModal();
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

            firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
                $(".loadingUser").hide();
                $(".loadedUser").show();
                
                if (userDocument.exists) {
                    currentUser.username = userDocument.data().username;

                    $(".loadingUserDetails").hide();

                    $(".currentUsername").text(currentUser.username);
                    localStorage.setItem("signedInUsername", currentUser.username);

                    if (userDocument.data().staff) {
                        $(".isNotStaff").hide();
                        $(".isStaff").show();
                    } else {
                        $(".isStaff").hide();
                        $(".isNotStaff").show();
                    }

                    if (userDocument.data().postPoints + userDocument.data().commentPoints >= 100 || userDocument.data().staff) {
                        $(".cannotCreateGroups").hide();
                        $(".canCreateGroups").show();
                    } else {
                        $(".canCreateGroups").hide();
                        $(".cannotCreateGroups").show();
                    }
    
                    firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").get().then(function(groupReferenceDocuments) {
                        $(".joinedGroups").html("");
    
                        if (groupReferenceDocuments.docs.length > 0) {
                            $(".joinedGroups").append($("<hr>"));
                        }
    
                        groupReferenceDocuments.forEach(function(groupReferenceDocument) {
                            $(".joinedGroups").append($("<button>")
                                .text("g/" + groupReferenceDocument.id)
                                .click(function() {
                                    window.location.href = "/g/" + groupReferenceDocument.id;
                                })
                            );
                        });
                    });
    
                    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
                        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    
                        firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").doc(groupName).get().then(function(userMembershipDocument) {
                            if (userMembershipDocument.exists) {
                                $(".groupJoinButton").text(_("Leave"));
                                $(".groupJoinButton").removeClass("blue");
                            }
                        });
                    }

                    if (trimPage(currentPage) == "settings") {
                        $(".settingsPersonalProperty").each(function() {
                            var propertyKey = $(this).attr("data-property");

                            if ($(this).hasClass("settingsPersonalProperty")) {
                               $(this).val(userDocument.data()[propertyKey]);
                            }
                        });

                        var countedBlockedUsers = 0;

                        $(".blockedUsers").html("");

                        if (Array.isArray(userDocument.data().blockedUsers) && userDocument.data().blockedUsers.length > 0) {
                            for (var i = 0; i < userDocument.data().blockedUsers.length; i++) {
                                (function(currentI, blockedUid) {
                                    firebase.firestore().collection("users").doc(blockedUid).get().then(function(blockedUserDocument) {
                                        if (blockedUserDocument.exists) {
                                            $(".blockedUsers").append(
                                                $("<card class='post inline'>")
                                                    .append([
                                                        $("<div class='content'>").append(
                                                            $("<a class='bold noColour'>")
                                                                .addClass(blockedUserDocument.data().staff ? "staffBadge" : "")
                                                                .attr("href", "/u/" + blockedUserDocument.data().username)
                                                                .text("u/" + blockedUserDocument.data().username)
                                                        )
                                                        ,
                                                        $("<div class='actions'>").append(
                                                            $("<div class='full'>").append(
                                                                $("<button>")
                                                                    .attr("aria-label", _("Unblock"))
                                                                    .append([
                                                                        $("<icon>").text("clear"),
                                                                        document.createTextNode(" "),
                                                                        $("<span>").text(_("Unblock"))
                                                                    ])
                                                                    .click(function() {
                                                                        var newBlockList = [];

                                                                        for (var i = 0; i < userDocument.data().blockedUsers.length; i++) {
                                                                            if (userDocument.data().blockedUsers[i] != blockedUid) {
                                                                                newBlockList.push(userDocument.data().blockedUsers[i]);
                                                                            }
                                                                        }

                                                                        if ($(this).closest(".blockedUsers").children().length == 1) {
                                                                            $(this).closest(".blockedUsers").html("").append(
                                                                                $("<p class='info middle'>").text(_("You're now friends with everyone again!"))
                                                                            );
                                                                        } else {
                                                                            $(this).closest("card.post.inline").remove();
                                                                        }

                                                                        api.saveSettings({
                                                                            type: "personal",
                                                                            changes: {
                                                                                blockedUsers: newBlockList
                                                                            }
                                                                        });
                                                                    })
                                                            )
                                                        )
                                                    ])
                                            );
    
                                            countedBlockedUsers++;
                                        }
    
                                        if (currentI == userDocument.data().blockedUsers.length - 1 && countedBlockedUsers == 0) {
                                            $(".blockedUsers").append(
                                                $("<p class='info middle'>").text(_("You haven't blocked any users yet"))
                                            );
                                        }
                                    });
                                })(i, String(userDocument.data().blockedUsers[i]));
                            }
                        } else {
                            $(".blockedUsers").append(
                                $("<p class='info middle'>").text(_("You haven't blocked any users yet"))
                            );
                        }
                    }
                } else {
                    firebase.firestore().collection("users").doc(currentUser.uid).set({
                        username: $("#signUpUsername").val(),
                        joined: firebase.firestore.FieldValue.serverTimestamp(),
                        postPoints: 0,
                        commentPoints: 0,
                        postCount: 0,
                        commentCount: 0
                    }).then(function() {
                        firebase.firestore().collection("usernames").doc($("#signUpUsername").val().toLowerCase()).set({
                            uid: currentUser.uid
                        }).then(function() {
                            $("#signUpUsernameButton").prop("disabled", false);
                            $("#signUpUsernameButton").text(_("Sign up"));
    
                            closeDialogs();
    
                            $("#signUpEmail").val("");
                            $("#signUpPassword").val("");
                            $("#signUpUsername").val("");
                        });
                    });
    
                    currentUser.username = $("#signUpUsername").val();
    
                    $(".currentUsername").text(currentUser.username);
                    localStorage.setItem("signedInUsername", currentUser.username);
                }
            });

            firebase.firestore().collection("users").doc(currentUser.uid).collection("auth").doc("banInfo").get().then(function(banInfoDocument) {
                $(".loadingBanStatus").hide();

                if (!banInfoDocument.exists) {
                    $(".hasBan").hide();
                    $(".hasNoBan").show();
        
                    return;
                }

                if (!!banInfoDocument.data().decisionFinal) {
                    $(".canSubmitBanAppeal").hide();
                    $(".cannotSubmitBanAppeal").show();
                }
        
                if (!!banInfoDocument.data().bannedForever) {
                    $(".banStatus").text(_("You are permanently banned from using Glipo."));

                    $(".hasNoBan").hide();
                    $(".hasBan").show();        
                    return;
                }
        
                if (banInfoDocument.data().bannedUntil != null && new Date().getTime() < banInfoDocument.data().bannedUntil.toDate().getTime()) {
                    var timeDifference = banInfoDocument.data().bannedUntil - new Date().getTime();

                    $(".banStatus").text(_("You are currently banned from using Glipo, but your ban will be lifted in {0}.", [simpleTimeDifferenceToHumanReadable(timeDifference)]));
        
                    return;
                }
        
                $(".hasBan").hide();
                $(".hasNoBan").show();
            });

            $(".signedOut").hide();
            $(".signedIn").show();
        } else {
            currentUser.uid = null;
            currentUser.username = null;

            $(".signedIn").hide();
            $(".signedOut").show();

            $(".currentUsername").text("");
            localStorage.removeItem("signedInUsername");

            $(".isStaff").hide();
            $(".isNotStaff").show();

            $(".canCreateGroups").hide();
            $(".cannotCreateGroups").show();

            $(".joinedGroups").html("");

            $(".userIsMe").hide();
            $(".userIsNotMe").show();

            $(".groupJoinButton").text(_("Join"));
            $(".groupJoinButton").addClass("blue");

            $(".postAuthoredByMe").hide();
            $(".postNotAuthoredByMe").show();
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

    $("html").on("click", ".tabs .tabstrip [data-tab]", function() {
        $(this).parent().parent().find(".tabcontents > *:not([data-tab='" + $(this).attr("data-tab") + "'])").hide();
        $(this).parent().parent().find(".tabcontents > [data-tab='" + $(this).attr("data-tab") + "']").show();

        $(this).parent().find("[data-tab]").removeClass("selected");
        $(this).addClass("selected");
    });

    $("html").on("click", ".spoiler", function() {
        $(this).toggleClass("open");
    });

    $("html").on("keypress", ".spoiler", function(event) {
        if (event.keyCode == 13) {
            $(this).toggleClass("open");
        }
    });

    $("nav .search input").keypress(function(event) {
        if (event.keyCode == 13) {
            if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
                window.location.href = "/g/" + trimPage(currentPage).split("/")[1].toLowerCase().trim() + "?q=" + encodeURIComponent($("nav .search input").val().trim());
            } else {
                window.location.href = "/?q=" + encodeURIComponent($("nav .search input").val().trim());
            }
        }
    })

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

    $("#submitGroup").change(function() {
        var submitGroup = $("#submitGroup").val();

        if (submitGroup.startsWith("g/")) {
            submitGroup = submitGroup.split("/")[1].trim();
        }

        $(".hasSubmitGroupRules").hide();
        $(".submitGroupRulesHeader").text(_("Rules of {0}", [submitGroup]));

        firebase.firestore().collection("groups").doc(submitGroup.toLowerCase() || "__NOGROUP").get().then(function(groupDocument) {
            $(".submitGroupRules").html("");

            if (groupDocument.exists && groupDocument.data().rules != null && groupDocument.data().rules.length > 0) {
                for (var i = 0; i < groupDocument.data().rules.length; i++) {
                    var rule = groupDocument.data().rules[i];

                    $(".submitGroupRules").append(
                        $("<details>").append(
                            $("<summary>").text(_("{0}. {1}", [i + 1, rule.title])),
                            $("<p>").text(rule.content)
                        )
                    );
                }

                $(".hasSubmitGroupRules").show();
            } else {
                $(".hasSubmitGroupRules").hide();
            }
        });
    });

    if (core.getURLParameter("q") != null) {
        $("nav .search input").val(core.getURLParameter("q"));
    }

    if (trimPage(currentPage) == "/") {
        firebase.firestore().collection("groups").orderBy("memberCount", "desc").limit(5).get().then(function(groupDocuments) {
            $(".trendingGroups").html("");

            groupDocuments.forEach(function(groupDocument) {
                $(".trendingGroups").append(
                    $("<p>").append(
                        $("<a class='bold noColour'>")
                            .attr("href", "/g/" + groupDocument.data().name)
                            .text("g/" + groupDocument.data().name)
                        ,
                        $("<br>"),
                        $("<span>").text(_("{0} members", groupDocument.data().memberCount))
                    )
                )
            });

            $(".loadedTrendingGroups").show();
        });
    } else if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        $(".groupName").text("g/" + groupName);
        $(".groupLink").attr("href", "/g/" + groupName);
        $(".groupNameModRequirement").text(_("You must be a moderator of g/{0} to access moderator tools for this group", [groupName]));
        $(".groupRulesHeader").text(_("Rules of {0}", [groupName]));

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                $(".groupName").text("g/" + groupDocument.data().name);
                $(".groupDescription").text(groupDocument.data().description || "");
                $(".groupNameModRequirement").text(_("You must be a moderator of g/{0} to access moderator tools for this group", [groupDocument.data().name]));

                $(".groupMemberCount").text(_("{0} members", [groupDocument.data().memberCount]));
                $(".groupPostCount").text(_("{0} posts", [groupDocument.data().postCount]));
                $(".groupCommentCount").text(_("{0} comments", [groupDocument.data().commentCount]));

                $(".groupRules").html("");

                if (groupDocument.data().rules != null && groupDocument.data().rules.length > 0) {
                    for (var i = 0; i < groupDocument.data().rules.length; i++) {
                        var rule = groupDocument.data().rules[i];

                        $(".groupRules").append(
                            $("<details>").append(
                                $("<summary>").text(_("{0}. {1}", [i + 1, rule.title])),
                                $("<p>").text(rule.content)
                            )
                        );
                    }

                    $(".hasRules").show();
                } else {
                    $(".hasNoRules").show();
                }

                $(".loadingRules").hide();
                $(".loadedRules").show();

                if (currentUser.uid != null) {
                    firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").doc(groupName).get().then(function(userMembershipDocument) {
                        if (userMembershipDocument.exists) {
                            $(".groupJoinButton").text(_("Leave"));
                            $(".groupJoinButton").removeClass("blue");
                        }
                    });
                }

                $(".visitGroupRules").click(function() {
                    window.location.href = "/g/" + groupName + "/rules";
                });
            } else {
                $(".loadingRules").hide();
                $(".pageExistent").hide();
                $(".pageNonExistent").show();
            }
        });
    } else if (currentPage.startsWith("u/") && trimPage(currentPage).split("/").length > 1) {
        var userProfileUsername = trimPage(currentPage).split("/")[1].toLowerCase().trim();
        var userProfileUid = null;

        firebase.firestore().collection("usernames").doc(userProfileUsername).get().then(function(usernameDocument) {
            if (usernameDocument.exists) {
                userProfileUid = usernameDocument.data().uid;

                firebase.firestore().collection("users").doc(userProfileUid).get().then(function(userDocument) {
                    $(".userUsername").text("u/" + userDocument.data().username);
                    $(".userJoinDate").text(_("Joined {0}", [lang.format(userDocument.data().joined.toDate(), lang.language, {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })]));
                    $(".userPoints").text(_("{0} points", [userDocument.data().postPoints + userDocument.data().commentPoints]));
                    $(".userPoints").attr("title", _("{0} post pts + {1} comment pts", [userDocument.data().postPoints, userDocument.data().commentPoints]));
                    $(".userPostCount").text(_("{0} posts", [userDocument.data().postCount]));
                    $(".userCommentCount").text(_("{0} comments", [userDocument.data().commentCount]));
                    $(".userBio").text(userDocument.data().bio || "");
                    $(".userAdminCommentary").text(userDocument.data().adminCommentary || "");

                    if (userDocument.data().staff) {
                        $(".userUsername").addClass("staffBadge");
                        $(".userUsername").attr("title", _("This user is a staff member of Glipo."));

                        if (userDocument.data().staffTitle != null) {
                            $(".userStaffTitle").text(userDocument.data().staffTitle);
                        } else {
                            $(".userStaffTitle").text(_("Staff member of Glipo"));
                        }
                    } else {
                        $(".userUsername").removeClass("staffBadge");
                        $(".userUsername").attr("title", "");
                        $(".userStaffTitle").html("");
                    }

                    if (currentUser.uid == userProfileUid) {
                        $(".userIsNotMe").hide();
                        $(".userIsMe").show();
                    } else {
                        $(".userIsMe").hide();
                        $(".userIsNotMe").show();
                    }

                    if (userDocument.data().postCount == 0 && userDocument.data().commentCount == 0) {
                        $(".loadingPosts").hide();
                        $(".loadedPosts").hide();
                        $(".noPosts").show();
                    }
                });
            } else {
                $(".loadingPosts").hide();
                $(".pageExistent").hide();
                $(".pageNonExistent").show();
            }
        });
    } else if (trimPage(currentPage) == "submit") {
        if (core.getURLParameter("group") != null) {
            $("#submitGroup").val("g/" + core.getURLParameter("group").trim());
            $("#submitGroup").change();
        }

        if (core.getURLParameter("title") != null) {
            $("#submitWriteupTitle, #submitMediaTitle, #submitLinkTitle").val(core.getURLParameter("title").trim());
        }

        if (core.getURLParameter("url") != null) {
            $("#submitLinkUrl").val(core.getURLParameter("url").trim());
            $("#submitLinkTab").click();
        }
    } else if (trimPage(currentPage) == "creategroup") {
        if (core.getURLParameter("group") != null) {
            $("#createGroupNameInput").val(core.getURLParameter("group"));

            checkCreateGroupDetails();
        }

        $("#createGroupNameInput").on("keyup change", checkCreateGroupDetails);
    }
});