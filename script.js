/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

const RE_IMAGE = /.*(\.png|\.jpg|\.jpeg|\.gif)/;
const RE_IMGUR = /https:\/\/imgur.com\/gallery\/(.*)/;
const RE_YOUTUBE = /(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)([a-zA-Z0-9_-]{1,64})/;
const RE_GIPHY = /https:\/\/giphy.com\/gifs\/(.*)/;
const RE_GFYCAT = /https:\/\/gfycat.com\/(.*)/;

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

        firebase.firestore().collection("usernames").doc($("#signUpUsername").val().toLowerCase()).get().then(function(document) {
            if (!document.exists) {
                accountRequiresSettingUp = true;

                firebase.auth().createUserWithEmailAndPassword($("#signUpEmail").val().trim(), $("#signUpPassword").val()).catch(function(error) {
                    accountRequiresSettingUp = false;

                    if (error.code == "auth/email-already-in-use") {
                        $("#signUpUsernameError").text(_("There already appears to be an account with that email address. Did you mean to sign in instead?"));
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
        $("#signUpUsernameError").text(_("Your username must only contain letters and numbers, and must be between 3-20 characters long."));
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
                $("#signInError").text(_("The email you have entered appears to be invalid. Go back, re-enter your email address and try again."));
            } else if (error.code == "auth/user-not-found") {
                $("#signInError").text(_("There appears to be no user with that email address. Did you mean to sign up instead?"));
            } else if (error.code == "auth/wrong-password") {
                $("#signInError").text(_("The password that you have entered is wrong and doesn't match this account's password. Try typing it in again."));
            } else {
                $("#signInError").text(_("We ran into a problem when signing into your account. Please check your internet connection and try again."));
            }

            $("#signInButton").prop("disabled", false);
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
        if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

            window.location.href = "/submit?group=" + encodeURIComponent(groupName);
        } else {
            window.location.href = "/submit";
        }
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
        
                api.submitPost({
                    group: submitGroup,
                    title: submitTitle.trim(),
                    content: submitContent,
                    type: "writeup"
                }).then(function(postId) {
                    window.location.href = "/g/" + submitGroup + "/posts/" + postId.data;
                }).catch(function(error) {
                    console.error("Glipo backend error:", error);
        
                    $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again."));
                    $(".submitButton").prop("disabled", false);
                    $(".submitButton").text(_("Submit"));
                });
            } else if (submitType == "media") {
                $("#submitError").text(_("The ability to upload media to post it is coming soon! Maybe at the end of this week or something."));
        
                return;
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
        
                api.submitPost({
                    group: submitGroup,
                    title: submitTitle.trim(),
                    content: submitContent.trim(),
                    type: "link"
                }).then(function(postId) {
                    window.location.href = "/g/" + submitGroup + "/posts/" + postId.data;
                }).catch(function(error) {
                    console.error("Glipo backend error:", error);
        
                    $("#submitError").text(_("Sorry, an internal error has occurred. Please try submitting your post again."));
                    $(".submitButton").prop("disabled", false);
                    $(".submitButton").text(_("Submit"));
                });
            }
        } else {
            $("#submitError").text(_("The group you entered doesn't exist! Check the group name and try again."));
        }
    });
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

                if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
                    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

                    firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").doc(groupName).get().then(function(userMembershipDocument) {
                        if (userMembershipDocument.exists) {
                            $(".groupJoinButton").text(_("Leave"));
                            $(".groupJoinButton").removeClass("blue");
                        }
                    });
                }
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

            $(".userIsMe").hide();
            $(".userIsNotMe").show();

            $(".groupJoinButton").text(_("Join"));
            $(".groupJoinButton").addClass("blue");
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

    $("html").on("keypress", ".spoiler", function() {
        if (event.keyCode == 13) {
            $(this).toggleClass("open");
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

    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        $(".groupName").text("g/" + groupName);

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                $(".groupName").text("g/" + groupDocument.data().name);
                $(".groupDescription").text(groupDocument.data().description || "");

                $(".groupMemberCount").text(_("{0} members", [groupDocument.data().memberCount]));
                $(".groupPostCount").text(_("{0} posts", [groupDocument.data().postCount]));
                $(".groupCommentCount").text(_("{0} comments", [groupDocument.data().commentCount]));

                if (currentUser.uid != null) {
                    firebase.firestore().collection("users").doc(currentUser.uid).collection("groups").doc(groupName).get().then(function(userMembershipDocument) {
                        if (userMembershipDocument.exists) {
                            $(".groupJoinButton").text(_("Leave"));
                            $(".groupJoinButton").removeClass("blue");
                        }
                    });
                }
            } else {
                $(".pageExistent").hide();
                $(".pageNonExistent").show();
            }
        });
    } else if (currentPage.startsWith("u/")) {
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

                    if (userDocument.data().postCount > 0) {
                        // TODO: Retrieve posts
                    } else {
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
        }
    }
});