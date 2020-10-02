/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var userToBlock = null;

function blockSelectedUser() {
    firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
        var blockedUsersList = [];

        if (Array.isArray(userDocument.data().blockedUsers)) {
            blockedUsersList = userDocument.data().blockedUsers;
        }

        if (blockedUsersList.indexOf(userToBlock) == -1) {
            blockedUsersList.push(userToBlock);

            firebase.firestore().collection("users").doc(currentUser.uid).set({
                blockedUsers: blockedUsersList
            }, {merge: true}).then(function() {
                window.location.reload();
            });
        }
    });

    closeDialogs();
}

function getNotifications(type = "unread") {
    $("." + type + "Notifications").hide();
    $("#" + type + "NotificationsTab .loadingSpinner").show();

    $("." + type + "Notifications").html("");

    firebase.firestore().collection("users").doc(currentUser.uid).collection(type + "Notifications").orderBy("sent", "desc").get().then(function(notificationDocuments) {
        $("#" + type + "NotificationsTab .loadingSpinner").hide();
        $("." + type + "Notifications").show();

        var notificationsAdded = 0;

        firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
            var blockedUsersList = [];

            if (Array.isArray(userDocument.data().blockedUsers)) {
                blockedUsersList = userDocument.data().blockedUsers;
            }
            
            notificationDocuments.forEach(function(notificationDocument) {
                if (blockedUsersList.indexOf(notificationDocument.data().sender) == -1) {
                    firebase.firestore().collection("users").doc(notificationDocument.data().sender).get().then(function(senderDocument) {
                        var blockedUsersList = [];

                        if (Array.isArray(userDocument.data().blockedUsers)) {
                            blockedUsersList = userDocument.data().blockedUsers;
                        }

                        $("." + type + "Notifications").append(
                            $("<card class='post'>").append([
                                $("<div class='info'>").append([
                                    (
                                        !senderDocument.exists ?
                                        $("<span>").text(_("Deleted user")) :
                                        $("<a class='group'>")
                                            .attr("href", "/u/" + senderDocument.data().username)
                                            .text("u/" + senderDocument.data().username)
                                            .addClass(senderDocument.data().staff ? "staffBadge" : "")
                                            .attr("title", senderDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                                    ),
                                    $("<span>").text(" · "),
                                    $("<span>")
                                        .attr("title",
                                            lang.format(notificationDocument.data().sent.toDate(), lang.language, {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }) + " " +
                                            notificationDocument.data().sent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                        )
                                        .text(timeDifferenceToHumanReadable(new Date().getTime() - notificationDocument.data().sent.toDate().getTime()))
                                ]),
                                $("<div class='postContent'>").html(renderMarkdown(notificationDocument.data().content)),
                                $("<div class='actions'>").append([
                                    $("<div>").append([
                                        $("<button>")
                                            .attr("aria-label", _("Reply"))
                                            .append([
                                                $("<icon>").text("reply"),
                                                document.createTextNode(" "),
                                                $("<span>").text(_("Reply"))
                                            ])
                                            .click(function() {
                                                if (notificationDocument.data().type == "message") {
                                                    window.location.href = "/dm?user=" + encodeURIComponent(senderDocument.data().username);
                                                } else if (notificationDocument.data().type == "comment") {
                                                    window.location.href = "/g/" + encodeURIComponent(notificationDocument.data().group) + "/posts/" + encodeURIComponent(notificationDocument.data().post) + "?comment=" + encodeURIComponent(notificationDocument.data().comment) + "&commentType=root";
                                                } else if (notificationDocument.data().type == "reply") {
                                                    window.location.href = "/g/" + encodeURIComponent(notificationDocument.data().group) + "/posts/" + encodeURIComponent(notificationDocument.data().post) + "?comment=" + encodeURIComponent(notificationDocument.data().comment) + "&commentType=reply";
                                                }
                                            })
                                    ]),
                                    $("<div>").append([
                                        $("<button>")
                                            .attr("title", notificationDocument.data().type == "message" ? _("Block") : _("Report"))
                                            .attr("aria-label", notificationDocument.data().type == "message" ? _("Block") : _("Report"))
                                            .append(
                                                $("<icon>").text(notificationDocument.data().type == "message" ? "block" : "flag")
                                            )
                                            .click(function() {
                                                if (notificationDocument.data().type == "message") {
                                                    userToBlock = notificationDocument.data().sender;

                                                    $(".blockUsername").html(_("Do you really want to block {0}? You can unblock them later in Glipo's settings.", [senderDocument.data().username]));

                                                    closeDialogs();
                                                    $(".blockUserDialog")[0].showModal();
                                                } else if (notificationDocument.data().type == "comment") {
                                                    reportComment(notificationDocument.data().group, notificationDocument.data().post, notificationDocument.data().comment, "root");
                                                } else if (notificationDocument.data().type == "reply") {
                                                    reportComment(notificationDocument.data().group, notificationDocument.data().post, notificationDocument.data().comment, "reply");
                                                }
                                            })
                                    ])
                                ])
                            ])
                        );
                    });

                    if (type == "unread") {
                        firebase.firestore().collection("users").doc(currentUser.uid).collection("unreadNotifications").doc(notificationDocument.id).delete().then(function() {
                            firebase.firestore().collection("users").doc(currentUser.uid).collection("archivedNotifications").doc(notificationDocument.id).set(notificationDocument.data());
                        });
                    }

                    notificationsAdded++;
                }
            });

            if (notificationsAdded == 0) {
                if (type == "unread") {
                    $(".unreadNotifications").append(
                        $("<div class='pageMessage middle'>").append([
                            $("<h1>").text(_("All caught up!")),
                            $("<p>").text(_("Looking for a notification from earlier? Check your archive!"))
                        ])
                    );
                } else if (type == "archived") {
                    $(".archivedNotifications").append(
                        $("<div class='pageMessage middle'>").append([
                            $("<h1>").text(_("No notifications yet!")),
                            $("<p>").text(_("You'll receive notifications here that have been previously read."))
                        ])
                    );
                }
            }
        });
    });
}

function getMessages() {
    $(".messageDms").hide();
    $("#messagesTab .loadingSpinner").show();

    $(".messageDms").html("");

    firebase.firestore().collection("users").doc(currentUser.uid).collection("dms").orderBy("lastSent", "desc").get().then(function(dmDocuments) {
        $("#messagesTab .loadingSpinner").hide();
        $(".messageDms").show();

        if (dmDocuments.docs.length > 0) {
            dmDocuments.forEach(function(dmDocument) {
                firebase.firestore().collection("usernames").doc(dmDocument.id).get().then(function(contactUsernameDocument) {
                    firebase.firestore().collection("users").doc(contactUsernameDocument.exists ? contactUsernameDocument.data().uid : "__NOUSER").get().then(function(contactDocument) {
                        $(".messageDms").append(
                            $("<card class='dm'>")
                                .append(
                                    $("<a>")
                                        .attr("href", "/dm?user=" + dmDocument.id)
                                        .text(
                                            !contactDocument.exists ?
                                            _("Deleted user") :
                                            "u/" + contactDocument.data().username
                                        )
                                        .addClass(contactDocument.exists ? (contactDocument.data().staff ? "staffBadge" : "") : "")
                                        .attr("title", contactDocument.exists ? (contactDocument.data().staff ? _("This user is a staff member of Glipo.") : null) : null)
                                    ,
                                    $("<div>").append([
                                        $("<span>").text(dmDocument.data().lastMessage.length > 100 ? dmDocument.data().lastMessage.substring(0, 100) + _("...") : dmDocument.data().lastMessage),
                                        $("<span>").text(" · "),
                                        $("<span>")
                                            .attr("title",
                                                lang.format(dmDocument.data().lastSent.toDate(), lang.language, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                }) + " " +
                                                dmDocument.data().lastSent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                            )
                                            .text(timeDifferenceToHumanReadable(new Date().getTime() - dmDocument.data().lastSent.toDate().getTime()))
                                    ])
                                )
                                .click(function() {
                                    window.location.href = "/dm?user=" + dmDocument.id;
                                })
                        );
                    });
                });
            });
        } else {
            $(".messageDms").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No messages yet!")),
                    $("<p>").text(_("To send a message to someone, visit their user profile."))
                ])
            );
        }
    });
}

function getDmMessages(user) {
    user = user.trim().toLowerCase();

    firebase.firestore().collection("usernames").doc(user).get().then(function(recipientUsernameDocument) {
        firebase.firestore().collection("users").doc(recipientUsernameDocument.exists ? recipientUsernameDocument.data().uid : "__NOUSER").get().then(function(recipientDocument) {
            firebase.firestore().collection("users").doc(currentUser.uid).collection("dms").doc(user).get().then(function(dmDocument) {                
                if (recipientDocument.exists || dmDocument.exists) {
                    if (!recipientUsernameDocument.exists || recipientUsernameDocument.data().uid != currentUser.uid) {
                        if (recipientDocument.exists) {
                            $(".dmHeader").text(_("Messages with u/{0}", [recipientDocument.data().username]));
                        } else {
                            $(".dmHeader").text(_("Messages with a deleted user"));
                            $(".dmReplyContainer").html("").append(
                                $("<card class='middle'>").text(_("You cannot reply to a deleted user"))
                            );
                        }
    
                        $("#dmMessageReply textarea").attr("placeholder", _("Write your message here..."));
                    
                        $(".pageNonExistent").hide();
                        $(".selfMessaging").hide();
                        $(".pageExistent").show();
                        $(".loadingDm").hide();
                        $(".loadedDm").show();
    
                        firebase.firestore().collection("users").doc(currentUser.uid).collection("dms").doc(user).collection("messages").orderBy("sent", "asc").onSnapshot(function(messageDocuments) {
                            $(".dmMessages").html("");
    
                            if (messageDocuments.docs.length > 0) {
                                firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
                                    messageDocuments.forEach(function(messageDocument) {
                                        $(".dmMessages").append(
                                            $("<card class='post'>")
                                                .addClass(messageDocument.data().me ? "myMessage" : "")
                                                .append([
                                                    $("<div class='info'>").append([
                                                        (
                                                            (messageDocument.data().me || recipientDocument.exists) ?
                                                            $("<a class='group'>")
                                                                .attr("href",
                                                                    messageDocument.data().me ?
                                                                    "/u/" + userDocument.data().username :
                                                                    "/u/" + recipientDocument.data().username
                                                                )
                                                                .text(
                                                                    messageDocument.data().me ?
                                                                    "u/" + userDocument.data().username :
                                                                    "u/" + recipientDocument.data().username
                                                                )
                                                                .addClass((messageDocument.data().me ? userDocument.data().staff : recipientDocument.data().staff) ? "staffBadge" : "")
                                                                .attr("title", (messageDocument.data().me ? userDocument.data().staff : recipientDocument.data().staff) ? _("This user is a staff member of Glipo.") : null)
                                                            :
                                                            $("<span>").text(_("Deleted user"))
                                                        ),
                                                        $("<span>").text(" · "),
                                                        $("<span>")
                                                            .attr("title",
                                                                lang.format(messageDocument.data().sent.toDate(), lang.language, {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric"
                                                                }) + " " +
                                                                messageDocument.data().sent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                                            )
                                                            .text(timeDifferenceToHumanReadable(new Date().getTime() - messageDocument.data().sent.toDate().getTime()))
                                                    ]),
                                                    $("<div class='postContent'>").html(renderMarkdown(messageDocument.data().content))
                                                ])
                                        );
    
                                        window.scrollTo(0, document.body.scrollHeight);
                                    });
                                });
                            } else {
                                $(".dmMessages").append(
                                    $("<p>").text(_("This is the beginning of something good... Write a message below to send it!"))
                                );
                            }
                        });
                    } else {
                        $(".loadingDm").hide();
                        $(".pageExistent").hide();
                        $(".pageNonExistent").hide();
                        $(".selfMessaging").show();
                    }
                } else {
                    $(".loadingDm").hide();
                    $(".pageExistent").hide();
                    $(".selfMessaging").hide();
                    $(".pageNonExistent").show();
                }
            });
        });
    });
}

function sendDmMessage() {
    var messageContent = $("#dmMessageReply textarea").val();

    if (messageContent.trim() == "") {
        $("#sendDmMessageError").text(_("Please enter the message you wish to send."));

        return;
    }

    if (messageContent.length > 10000) {
        $("#sendDmMessageError").text(_("Your message is too long! Please shorten it so that it's at most 10,000 characters long. You may want to split your message up into multiple parts."));

        return;
    }

    firebase.firestore().collection("users").doc(currentUser.uid).get().then(function(userDocument) {
        $(".dmMessages").append(
            $("<card class='post myMessage'>").append([
                $("<div class='info'>").append([
                    $("<a class='group'>")
                        .attr("href", "/u/" + userDocument.data().username)
                        .text("u/" + userDocument.data().username)
                        .addClass(userDocument.data().staff ? "staffBadge" : "")
                        .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                    ,
                    $("<span>").text(" · "),
                    $("<span>").text(_("Sending..."))
                ]),
                $("<div class='postContent'>").html(renderMarkdown(messageContent))
            ])
        );
    });

    $("#dmMessageReply textarea").val("");

    api.sendMessage({
        recipient: core.getURLParameter("user").trim(),
        content: messageContent
    }).catch(function(error) {
        console.error("Glipo backend error:", error);

        $("#sendDmMessageError").text(_("Sorry, an internal error has occurred and your last message couldn't be delivered to the sender."));
    });
}

function enablePushNotifications() {
    if ("Notification" in window) {
        $(".notificationsNotEnabled").hide();

        Notification.requestPermission().then(function(result) {
            if (result == "granted") {
                cloudMessaging.getToken().then(function(token) {
                    firebase.firestore().collection("users").doc(currentUser.uid).collection("notificationTokens").doc(token).set({
                        added: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(function() {
                        new Notification(_("Notifications are enabled!"), {
                            body: _("You're all set to receive notifications from Glipo! 🎉")
                        });
                    });
                });
            }
        });
    }
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (trimPage(currentPage) == "notifications") {
                getNotifications("unread");
                getNotifications("archived");

                getMessages();
            } else if (trimPage(currentPage) == "dm") {
                if (core.getURLParameter("user") != null && core.getURLParameter("user").trim() != "") {
                    getDmMessages(core.getURLParameter("user").trim());
                } else {
                    window.location.replace("/notifications");
                }
            }

            firebase.firestore().collection("users").doc(user.uid).collection("unreadNotifications").onSnapshot(function(notificationDocuments) {
                if (notificationDocuments.docs.length > 0) {
                    $(".notificationsButton")
                        .addClass("yellow")
                        .attr("title", _("Notifications ({0})", [notificationDocuments.docs.length]))
                    ;

                    $(".notificationsButton icon")
                        .attr("aria-label", _("Notifications ({0})", [notificationDocuments.docs.length]))
                        .text("notifications_active")
                    ;
                } else {
                    $(".notificationsButton")
                        .removeClass("yellow")
                        .attr("title", _("Notifications"))
                    ;

                    $(".notificationsButton icon")
                        .attr("aria-label", _("Notifications"))
                        .attr("title", null)
                        .text("notifications")
                    ;
                }
            });

            if ("Notification" in window && Notification.permission != "granted") {
                $(".notificationsNotEnabled").show();
            }
        }
    });
});