/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var groupModerators = [];

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

function getModeratorList() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    firebase.firestore().collection("groups").doc(groupName).collection("members").where("moderator", "==", true).get().then(function(moderatorMemberDocuments) {
        $("#moderators .modMemberList").html("");
        $("#moderators .loadingSpinner").hide();

        $("#moderators .modMemberList").hide();
        $("#moderators .modMemberList").show();

        moderatorMemberDocuments.forEach(function(moderatorMemberDocument) {
            firebase.firestore().collection("users").doc(moderatorMemberDocument.id).get().then(function(moderatorDocument) {
                $("#moderators .modMemberList").append(
                    $("<card class='clickable'>")
                        .append([
                            $("<a class='bold'>")
                                .addClass(moderatorDocument.data().staff ? "staffBadge" : "moderatorBadge")
                                .attr("href", "/u/" + moderatorDocument.data().username)
                                .text("u/" + moderatorDocument.data().username)
                        ])
                        .click(function() {
                            window.location.href = "/u/" + moderatorDocument.data().username;
                        })
                );
            });
        });
    });
}

function modVisitGroup() {
    var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

    window.location.href = "/g/" + groupName;
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

$(function() {
    if (currentPage.startsWith("g/") && trimPage(currentPage).split("/").length > 1) {
        var groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        $(".modmailHeading").text(_("Message moderators of {0}", [groupName]));

        firebase.firestore().collection("groups").doc(groupName).get().then(function(groupDocument) {
            if (groupDocument.exists) {
                $(".modmailHeading").text(_("Message moderators of {0}", [groupDocument.data().name]));
                $(".modmailMessage").html(renderMarkdown(groupDocument.data().modmailMessage || ""));

                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        firebase.firestore().collection("groups").doc(groupName).collection("members").doc(currentUser.uid).get().then(function(memberDocument) {
                            if (memberDocument.exists && memberDocument.data().moderator) {
                                $(".isNotModerator").hide();
                                $(".isModerator").show();

                                $("#modModqueue .loadingSpinner").hide();
                                $("#modReports .loadingSpinner").hide();

                                getModModqueue();
                                getModReports();
                                getModeratorList();
                            } else {
                                $(".isModerator").hide();
                                $(".isNotModerator").show();
                            }
                        });
                    } else {
                        $(".isModerator").hide();
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