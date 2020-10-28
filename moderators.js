/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

const permTypes = {
    OWNER: "owner",
    MODERATOR: "moderator",
    MEMBER: "member",
    BANNED: "banned"
};

var groupModerators = [];
var usernameToChangePermsOf;
var editRuleOldIndex;

function modRemovePost() {
    if ($("#modRemovePostModReason").val().trim() == "") {
        $("#modRemovePostModError").text(_("Please enter the reason for removing the post."));

        return;
    }

    if ($("#modRemovePostModReason").val().length > 5000) {
        $("#modRemovePostModError").text(_("The reason is too long! Please shorten it so that it's at most 5,000 characters long."));

        return;
    }

    api.removePost({
        group: removedModqueueGroup,
        post: removedModqueuePost,
        reason: $("#modRemovePostModReason").val(),
        forceMod: true
    });

    getModModqueue();
    closeDialogs();
}

function getModModqueue() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    var modqueueReference = firebase.firestore().collection("groups").doc(groupName).collection("posts").where("moderatorApproved", "==", false).where("moderatorRemoved", "==", false).orderBy("posted", "asc");

    if (lastModqueuePost != null) {
        modqueueReference = modqueueReference.startAfter(lastModqueuePost);
    }

    modqueueReference = modqueueReference.limit(10);

    modqueueReference.get().then(function(postDocuments) {
        $("#modModqueue .modqueueItems").html("");

        if (postDocuments.docs.length > 0) {
            postDocuments.forEach(function(postDocument) {
                if (postDocument.exists) {
                    firebase.firestore().collection("users").doc(postDocument.data().author || "__NOUSER").get().then(function(userDocument) {
                        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
                            var postContent = "";

                            if (postDocument.data().deleted) {
                                api.approvePost({
                                    group: groupName,
                                    post: postDocument.id,
                                    forceMod: true
                                });
                                
                                return;
                            }

                            if (postDocument.data().type == "writeup") {
                                postContent = renderMarkdown(postDocument.data().content);
                            } else if (postDocument.data().type == "link") {
                                postContent = renderLink(postDocument.data().content);
                            }

                            $("#modModqueue .modqueueItems").append(
                                $("<card class='post clickable'>")
                                    .append([
                                        $("<div class='info'>").append([
                                            (
                                                !userDocument.exists ?
                                                $("<span>").text(_("Posted by a deleted user")) :
                                                $("<span>").html(_("Posted by {0}", [
                                                    $("<div>").append(
                                                        $("<a>")
                                                            .attr("href", "/u/" + userDocument.data().username)
                                                            .text("u/" + userDocument.data().username)
                                                            .addClass(userDocument.data().staff ? "staffBadge" : "")
                                                            .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                                                    ).html()
                                                ]))
                                            ),
                                            $("<span>").text(" · "),
                                            $("<span>")
                                                .attr("title",
                                                    lang.format(postDocument.data().posted.toDate(), lang.language, {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    }) + " " +
                                                    postDocument.data().posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                                )
                                                .text(timeDifferenceToHumanReadable(new Date().getTime() - postDocument.data().posted.toDate().getTime()))
                                        ]),
                                        $("<h2 class='title'>").append(
                                            $("<a>")
                                                .attr("href", "/g/" + groupName + "/posts/" + postDocument.id)
                                                .attr("target", "_blank")
                                                .text(postDocument.data().title)
                                        ),
                                        $("<div class='postContent'>")
                                            .addClass(postDocument.data().type)
                                            .html(postContent)
                                        ,
                                        $("<div class='actions'>").append([
                                            $("<div class='full'>").append([
                                                $("<button>")
                                                    .attr("aria-label", _("Approve"))
                                                    .append([
                                                        $("<icon>").text("done"),
                                                        document.createTextNode(" "),
                                                        $("<span>").text(_("Approve"))
                                                    ])
                                                    .click(function() {
                                                        api.approvePost({
                                                            group: groupName,
                                                            post: postDocument.id,
                                                            forceMod: true
                                                        });
                                                        $(this).closest("card.post").remove();

                                                        lastModqueuePost = postDocument;

                                                        getModModqueue();
                                                    })
                                                ,
                                                document.createTextNode(" "),
                                                $("<button>")
                                                    .attr("aria-label", _("Remove"))
                                                    .append([
                                                        $("<icon>").text("clear"),
                                                        document.createTextNode(" "),
                                                        $("<span>").text(_("Remove"))
                                                    ])
                                                    .click(function() {
                                                        removedModqueueGroup = groupName;
                                                        removedModqueuePost = postDocument.id;
                                                        lastModqueuePost = postDocument;
                                                        
                                                        $("#modRemovePostModReason").val("");
                                                        $("#modRemovePostModError").text("");
                                                        $(".modRemovePostModDialog")[0].showModal();
                                                        $("#modRemovePostModReason").focus();
                                                    })
                                            ])
                                        ])
                                    ])
                                    .click(function(event) {
                                        if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                            window.open("/g/" + groupName + "/posts/" + postDocument.id);
                                        }
                                    })
                            );
                        });
                    });
                }
            });
        } else {
            $("#modModqueue .modqueueItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No posts to moderate right now!")),
                    $("<p>").text(_("Check back later when the modqueue has posts to review."))
                ])
            );
        }
    });
}

function getModReports() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    var reportsReference = firebase.firestore().collection("groups").doc(groupName).collection("reports").orderBy("sent", "asc").limit(10);

    reportsReference.get().then(function(reportsDocuments) {
        $("#modReports .modReportItems").html("");

        if (reportsDocuments.docs.length > 0) {
            reportsDocuments.forEach(function(reportDocument) {
                var reportedContentReference = firebase.firestore().collection("groups").doc(groupName).collection("posts").doc(reportDocument.data().post);
                
                if (reportDocument.data().type == "root" || reportDocument.data().type == "reply") {
                    reportedContentReference = reportedContentReference.collection(reportDocument.data().type + "Comments").doc(reportDocument.data().comment);
                }

                reportedContentReference.get().then(function(reportedContentDocument) {
                    firebase.firestore().collection("users").doc(reportDocument.data().reporter).get().then(function(reporterDocument) {
                        firebase.firestore().collection("users").doc(reportedContentDocument.exists ? reportedContentDocument.data().author : "__NOUSER").get().then(function(offenderDocument) {
                            var excerpt = [];
                            var extraDetails = [];
                            var groupRuleViolation = [];

                            if (reportedContentDocument.exists) {
                                if (reportDocument.data().type == "post") {
                                    excerpt = [
                                        $("<p>").append(
                                            $("<a target='_blank'>")
                                                .attr("href", "/g/" + groupName + "/posts/" + reportDocument.data().post)
                                                .text(_("Post title: {0}", [reportedContentDocument.data().title]))
                                        ),
                                        $("<blockquote>").html(
                                            renderMarkdown(reportedContentDocument.data().content.substring(0, 300))
                                        )
                                    ];
                                } else if (reportDocument.data().type == "root" || reportDocument.data().type == "reply") {
                                    excerpt = [
                                        $("<p>").append(
                                            $("<a target='_blank'>")
                                                .attr("href", "/g/" + groupName + "/posts/" + reportDocument.data().post)
                                                .text(_("Comment exceprt:"))
                                        ),
                                        $("<blockquote>").html(
                                            renderMarkdown(reportedContentDocument.data().content.substring(0, 300))
                                        )
                                    ];
                                }
                            }

                            if (reportDocument.data().reason == "rules") {
                                groupRuleViolation = [
                                    $("<p>").text(_("Group rule violated: {0}", [reportDocument.data().ruleTitle])),
                                    $("<blockquote>").html(
                                        renderMarkdown(reportDocument.data().ruleTitle)
                                    )
                                ];
                            }

                            if (!!reportDocument.data().extra) {
                                extraDetails = [
                                    $("<p>").text(_("Extra report details:")),
                                    $("<blockquote>").text(reportDocument.data().extra)
                                ];
                            }

                            $("#modReports .modReportItems").append(
                                $("<card class='reportItem'>")
                                    .append(
                                        $("<details>").append([
                                            $("<summary>").text(reportTypes[reportDocument.data().reason].moderatorDescription),
                                            (
                                                reportedContentDocument.exists ?
                                                $("<p>").html(_("Reported by {0} · Against {1}", [reporterDocument.data().username, offenderDocument.data().username])) :
                                                $("<p>").text(_("Certain report information is unavailable."))
                                            ),
                                            $("<p>").text(
                                                lang.format(reportDocument.data().sent.toDate(), lang.language, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                }) + " " +
                                                reportDocument.data().sent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                            ),
                                            ...excerpt,
                                            ...groupRuleViolation,
                                            ...extraDetails,
                                            $("<div class='buttonRow'>").append([
                                                $("<button class='blue'>")
                                                    .text(_("Act"))
                                                    .click(function() {
                                                        actingReportId = reportDocument.id;
                                                        actingOnStaffReport = false;

                                                        $("#actOnReportModReason").val(reportTypes[reportDocument.data().reason].removalReason);
                                                        $("#actOnReportModNoMessage").prop("checked", true);
                                                        $("#actOnReportModDeleteContent").prop("checked", false);
                                                        $("#actOnReportModBanOffender").prop("checked", false);

                                                        $(".actOnReportModDialog")[0].showModal();
                                                        $("#actOnReportModReason").focus();
                                                    })
                                                ,
                                                $("<button>").text(_("Dismiss"))
                                                    .click(function(event) {
                                                        $(event.target).prop("disabled", true);
                                                        $(event.target).text(_("Dismissing..."));

                                                        api.dismissReport({
                                                            group: groupName,
                                                            report: reportDocument.id
                                                        }).then(function() {
                                                            getModReports();
                                                        });
                                                    })
                                            ])
                                        ])
                                    )
                            );
                        });
                    });
                });
            });
        } else {
            $("#modReports .modReportItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No reports to deal with right now!")),
                    $("<p>").text(_("Check back later when the report list has reports to act upon."))
                ])
            );
        }
    });
}

function changeMemberPerms() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    var newPerms = $("[name='changePermsModPermissions']:checked").val();

    $(".changePermsModButton").prop("disabled", true);
    $(".changePermsModButton").text(_("Granting..."));

    checkBanStatePage(function() {
        firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
            if (memberDocument.exists && memberDocument.data().owner) {
                api.changeMemberPerms({
                    group: groupName,
                    user: usernameToChangePermsOf.toLowerCase(),
                    permissions: newPerms
                }).then(function() {
                    getMemberList();
                    closeDialogs();
        
                    $(".changePermsModButton").prop("disabled", false);
                    $(".changePermsModButton").text(_("Grant"));

                    firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
                        if (!(memberDocument.exists && memberDocument.data().moderator)) {
                            $(".isModerator").hide();
                            $(".isNotModerator").show();
                        }
                    });
                }).catch(function(error) {
                    console.error("Glipo backend error:", error);
        
                    $("#changePermsModError").text(_("Sorry, an internal error has occurred. Please try changing this user's permissions again later."));
                    $(".changePermsModButton").prop("disabled", false);
                    $(".changePermsModButton").text(_("Grant"));
                });
            } else {
                $("#changePermsModError").text(_("You need to be a moderator with owner permissions in order to grant permissions to other users."));
                $(".changePermsModButton").prop("disabled", false);
                $(".changePermsModButton").text(_("Grant"));
            }
        });
    });
}

function showChangeMemberPermsDialog(username, currentPerms) {
    usernameToChangePermsOf = username;

    $("#changePermsModDescription").html(_("What permissions do you wish to grant to {0}?", [username]));
    $("#changePermsModError").text("");
    $("[name='changePermsModPermissions']").prop("checked", false);
    $("[name='changePermsModPermissions'][value='" + currentPerms + "']").prop("checked", true);
    $(".changePermsModDialog")[0].showModal();
}

function getMemberList() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).collection("members").get().then(function(memberDocuments) {
        $("#modMembers .modMemberList").html("");
        $("#modMembers .loadingSpinner").hide();

        $("#modMembers .modMemberList").hide();
        $("#modMembers .modMemberList").show();

        memberDocuments.forEach(function(memberDocument) {
            firebase.firestore().collection("groups").doc(groupName).collection("bans").doc(memberDocument.id).get().then(function(banInfoDocument) {
                var userPerms = permTypes.MEMBER;
                var userPermsText = "";

                if (banInfoDocument.exists && (
                        banInfoDocument.data().bannedForever ||
                        (banInfoDocument.data().bannedUntil != null && new Date().getTime() < banInfoDocument.data().bannedUntil.toDate().getTime())
                )) {
                    userPerms = permTypes.BANNED;
                } else if (memberDocument.data().moderator) {
                    if (memberDocument.data().owner) {
                        userPerms = permTypes.OWNER;
                    } else {
                        userPerms = permTypes.MODERATOR;
                    }
                }

                if (userPerms == permTypes.OWNER) {
                    userPermsText = _("Owner");
                } else if (userPerms == permTypes.MODERATOR) {
                    userPermsText = _("Standard moderator");
                } else if (userPerms == permTypes.MEMBER) {
                    userPermsText = _("Member");
                } else if (userPerms == permTypes.BANNED) {
                    userPermsText = _("Banned user");
                }

                firebase.firestore().collection("users").doc(memberDocument.id).get().then(function(userDocument) {
                    $("#modMembers .modMemberList").append(
                        $("<card class='clickable'>")
                            .append([
                                $("<a class='bold noColour'>")
                                    .addClass(userDocument.data().staff ? "staffBadge" : (memberDocument.data().moderator ? "moderatorBadge" : ""))
                                    .attr("href", "javascript:void();")
                                    .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : (memberDocument.data().moderator ? _("This user is a moderator of this group.") : null))
                                    .text("u/" + userDocument.data().username)
                                ,
                                $("<span>").text(" · "),
                                $("<span>").text(userPermsText)
                            ])
                            .click(function() {
                                showChangeMemberPermsDialog(userDocument.data().username, userPerms);
                            })
                    );
                });
            });
        });
    });
}

function getModModmail() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).collection("modmail").get().then(function(modmailDocuments) {
        $("#modmail .modModmailList").html("");
        $("#modmail .modModmailList").append([
            $("<h2 class='unreadHeader'>").text(_("Unread")).hide(),
            $("<div class='unread'>"),
            $("<h2 class='archivedHeader'>").text(_("Archived")).hide(),
            $("<div class='archived'>")
        ]);

        if (modmailDocuments.docs.length > 0) {
            modmailDocuments.forEach(function(modmailDocument) {
                firebase.firestore().collection("users").doc(modmailDocument.data().sender).get().then(function(userDocument) {
                    if (modmailDocument.data().archived) {
                        $("#modmail .modModmailList .archivedHeader").show();
                    } else {
                        $("#modmail .modModmailList .unreadHeader").show();
                    }

                    $(modmailDocument.data().archived ? "#modmail .modModmailList .archived" : "#modmail .modModmailList .unread").append(
                        $("<card class='post'>")
                            .append([
                                $("<div class='info'>").append([
                                    (
                                        !userDocument.exists ?
                                        $("<span>").text(_("Sent by a deleted user")) :
                                        $("<span>").html(_("Sent by {0}", [
                                            $("<div>").append(
                                                $("<a>")
                                                    .attr("href", "/u/" + userDocument.data().username)
                                                    .text("u/" + userDocument.data().username)
                                                    .addClass(userDocument.data().staff ? "staffBadge" : "")
                                                    .attr("title", userDocument.data().staff ? _("This user is a staff member of Glipo.") : null)
                                            ).html()
                                        ]))
                                    ),
                                    $("<span>").text(" · "),
                                    $("<span>")
                                        .attr("title",
                                            lang.format(modmailDocument.data().sent.toDate(), lang.language, {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }) + " " +
                                            modmailDocument.data().sent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                        )
                                        .text(timeDifferenceToHumanReadable(new Date().getTime() - modmailDocument.data().sent.toDate().getTime()))
                                ]),
                                $("<div class='postContent'>")
                                    .html(renderMarkdown(modmailDocument.data().content))
                                ,
                                $("<div class='actions'>").append([
                                    $("<div class='full'>").append([
                                        $("<button>")
                                            .attr("aria-label", _("Reply"))
                                            .prop("disabled", !userDocument.exists)
                                            .append([
                                                $("<icon>").text("reply"),
                                                document.createTextNode(" "),
                                                $("<span>").text(_("Reply"))
                                            ])
                                            .click(function() {
                                                window.open("/dm?user=" + encodeURIComponent(userDocument.data().username));

                                                if (!modmailDocument.data().archived) {
                                                    api.archiveModmail({
                                                        group: groupName,
                                                        modmail: modmailDocument.id
                                                    });

                                                    $(this).parent().find(".modmailArchiveButton").prop("disabled", true);
                                                    $(this).parent().find(".modmailArchiveButton span").text(_("Archived!"));
                                                }
                                            })
                                        ,
                                        ...(
                                            !modmailDocument.data().archived ?
                                            [
                                                document.createTextNode(" "),
                                                $("<button class='modmailArchiveButton'>")
                                                    .attr("aria-label", _("Archive"))
                                                    .append([
                                                        $("<icon>").text("archive"),
                                                        document.createTextNode(" "),
                                                        $("<span>").text(_("Archive"))
                                                    ])
                                                    .click(function() {
                                                        api.archiveModmail({
                                                            group: groupName,
                                                            modmail: modmailDocument.id
                                                        });
        
                                                        $(this).prop("disabled", true);
                                                        $(this).find("span").text(_("Archived!"));
                                                    })
                                            ] :
                                            []
                                        )
                                    ])
                                ])
                            ])
                            .click(function(event) {
                                if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                    window.open("/g/" + groupName + "/posts/" + postDocument.id);
                                }
                            })
                    )
                });
            });
        } else {
            $("#modmail .modModmailList").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No modmail yet!")),
                    $("<p>").text(_("Messages sent from your group's members will arrive here."))
                ])
            );
        }
    });
}

function getModSettingsRules() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
        $(".modSettingsRules").html("");

        if (groupDocument.data().rules != null && groupDocument.data().rules.length > 0) {
            for (var i = 0; i < groupDocument.data().rules.length; i++) {
                var rule = groupDocument.data().rules[i];

                (function(i) {
                    $(".modSettingsRules").append(
                        $("<card class='post inline'>")
                            .append([
                                $("<div class='content'>").append(
                                    $("<strong>")
                                        .attr("title", rule.content)
                                        .text(_("{0}. {1}", [i + 1, rule.title]))
                                )
                                ,
                                $("<div class='actions'>").append(
                                    $("<div class='full'>").append(
                                        $("<button>")
                                            .attr("aria-label", _("Edit"))
                                            .append([
                                                $("<icon>").text("edit"),
                                                document.createTextNode(" "),
                                                $("<span>").text(_("Edit"))
                                            ])
                                            .click(function() {
                                                editRuleOldIndex = i;

                                                $("#editRuleModPosition").html("");
    
                                                for (var j = 0; j < groupDocument.data().rules.length; j++) {
                                                    $("#editRuleModPosition").append(
                                                        $("<option>")
                                                            .attr("value", j)
                                                            .text(_("{0}.", [j + 1]))
                                                    )
                                                }
    
                                                $("#editRuleModPosition").val(String(i));
                                                $("#editRuleModTitle").val(rule.title);
                                                $("#editRuleModContent").val(rule.content);
    
                                                $(".editRuleModDialog")[0].showModal();
                                            })
                                    )
                                )
                            ])
                    );
                })(i);
            }

            $(".hasNoRules").hide();
            $(".hasRules").show();
        } else {
            $(".hasRules").hide();
            $(".hasNoRules").show();
        }
    });
}

function modVisitGroup() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    window.location.href = "/g/" + groupName;
}

function modVisitSettings() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    window.location.href = "/g/" + groupName + "/settings";
}

function saveGroupSettings(settings, callback, errorCallback) {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
        var changes = {
            ...groupDocument.data(),
            ...settings
        };

        api.saveGroupSettings({
            group: groupName,
            changes: changes
        }).then(function() {
            callback();
        }).catch(function(error) {
            console.error("Glipo backend error:", error);

            errorCallback();
        });
    });
}

function saveGroupProfile() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    if ($("#modSettingsGroupName").val().toLowerCase() != groupName.toLowerCase()) {
        $("#modSettingsProfileError").text(_("Sorry, the new group name must be the same as the old group name, excluding casing changes."));

        return;
    }

    if ($("#modSettingsGroupDescription").val().trim() == "") {
        $("#modSettingsProfileError").text(_("Please enter the group's description."));

        return;
    }

    $("#modSettingsProfileButton").prop("disabled", true);
    $("#modSettingsProfileButton").text(_("Saving..."));

    saveGroupSettings({
        name: $("#modSettingsGroupName").val(),
        description: $("#modSettingsGroupDescription").val().trim()
    }, function() {
        $("#modSettingsProfileButton").prop("disabled", false);
        $("#modSettingsProfileButton").text(_("Save"));
    }, function() {
        $("#modSettingsProfileError").text(_("Sorry, an internal error has occurred. Please try saving these settings again later."));
        $("#modSettingsProfileButton").prop("disabled", false);
        $("#modSettingsProfileButton").text(_("Save"));
    });
}

function saveGroupModmailSettings() {
    if ($("#modSettingsModmailMessage textarea").val().length > 10000) {
        $("#modSettingsProfileError").text(_("Your welcome message is too long! Please shorten it so that it's at most 10,000 characters long."));

        return;
    }

    $("#modSettingsModmailButton").prop("disabled", true);
    $("#modSettingsModmailButton").text(_("Saving..."));

    saveGroupSettings({
        modmailMessage: $("#modSettingsModmailMessage textarea").val()
    }, function() {
        $("#modSettingsModmailButton").prop("disabled", false);
        $("#modSettingsModmailButton").text(_("Save"));
    }, function() {
        $("#modSettingsModmailError").text(_("Sorry, an internal error has occurred. Please try saving these settings again later."));
        $("#modSettingsModmailButton").prop("disabled", false);
        $("#modSettingsModmailButton").text(_("Save"));
    });
}

function visitModmailSender() {
    if (currentUser.uid != null) {
        checkBanStatePage(function() {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

            window.location.href = "/g/" + groupName + "/modmail";
        });
    } else {
        showSignUpDialog();
    }
}

function sendModmail() {
    if (currentUser.uid != null) {
        checkBanStatePage(function() {
            var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

            if ($("#modmailSendContent textarea").val().trim() == "") {
                $("#modmailSendError").text(_("Please enter your message."));

                return;
            }

            if ($("#modmailSendContent textarea").val().length > 5000) {
                $("#modmailSendError").text(_("Your message is too long! Please shorten it so that it's at most 5,000 characters long."));

                return;
            }

            $(".modmailSendButton").prop("disabled", true);
            $(".modmailSendButton").text(_("Sending..."));

            api.sendModmail({
                group: groupName,
                content: $("#modmailSendContent textarea").val()
            }).then(function() {
                $(".modmailSendButton").text(_("Sent!"));
            }).catch(function(error) {
                console.error("Glipo backend error:", error);
    
                $("#modmailSendError").text(_("Sorry, an internal error has occurred. Please try sending your message again later."));
                $(".modmailSendButton").prop("disabled", false);
                $(".modmailSendButton").text(_("Send"));
            });
        });
    } else {
        $("#modmailSendError").text(_("Please sign in to send your message."));
    }
}

$(function() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        $(".modSettingsHeading").text(_("Settings for {0}", [groupName]));
        $(".modmailHeading").text(_("Message the moderators of {0}", [groupName]));

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                $(".modSettingsHeading").text(_("Settings for {0}", [groupDocument.data().name]));
                $(".modmailHeading").text(_("Message the moderators of {0}", [groupDocument.data().name]));
                $(".modmailMessage").html(renderMarkdown(groupDocument.data().modmailMessage || ""));

                $("#modSettingsGroupName").val(groupDocument.data().name);
                $("#modSettingsGroupDescription").val(groupDocument.data().description);
                $("#modSettingsModmailMessage textarea").val(groupDocument.data().modmailMessage || "");

                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        checkGroupBanState(groupName, function() {
                            firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
                                if (memberDocument.exists && memberDocument.data().moderator) {
                                    $(".isNotModerator").hide();
                                    $(".isModerator").show();
    
                                    $("#modModqueue .loadingSpinner").hide();
                                    $("#modReports .loadingSpinner").hide();
                                    $("#modmail .loadingSpinner").hide();
    
                                    getModModqueue();
                                    getModReports();
                                    getModModmail();
                                    getMemberList();
                                    getModSettingsRules();
                                } else {
                                    $(".isModerator").hide();
                                    $(".isGroupBanned").hide();
                                    $(".isNotModerator").show();
                                }
                            });
                        }, function() {
                            $(".isModerator").hide();
                            $(".isNotModerator").hide();
                            $(".isGroupBanned").show();
                        });
                    } else {
                        $(".isModerator").hide();
                        $(".isGroupBanned").hide();
                        $(".isNotModerator").show();
                    }
                });

                firebase.firestore().collection("groups").doc(groupName).collection("members").where("moderator", "==", true).get().then(function(moderatorDocuments) {
                    moderatorDocuments.forEach(function(moderatorDocument) {
                        groupModerators.push(moderatorDocument.id);
                    });
                });
            } else if (trimPage(currentPage).split("/").length > 2 && (trimPage(currentPage).split("/")[2] == "modtools" || trimPage(currentPage).split("/")[2] == "modmail")) {
                window.location.replace("/404.html");
            }
        });
    } else {
        $(".isModerator").hide();
        $(".isNotModerator").show();
    }
});