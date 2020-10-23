/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var lastModqueuePost = null;
var removedModqueueGroup = null;
var removedModqueuePost = null;

var actingReportId = null;
var actingOnStaffReport = true;

function staffRemovePost() {
    if ($("#staffRemovePostModReason").val().trim() == "") {
        $("#staffRemovePostModError").text(_("Please enter the reason for removing the post."));

        return;
    }

    if ($("#staffRemovePostModReason").val().length > 5000) {
        $("#staffRemovePostModError").text(_("The reason is too long! Please shorten it so that it's at most 5,000 characters long."));

        return;
    }

    api.removePost({
        group: removedModqueueGroup,
        post: removedModqueuePost,
        reason: $("#staffRemovePostModReason").val()
    });

    getStaffModqueue();
    closeDialogs();
}

function getStaffModqueue() {
    var modqueueReference = firebase.firestore().collection("staffModqueue").orderBy("posted", "asc");

    if (lastModqueuePost != null) {
        modqueueReference = modqueueReference.startAfter(lastModqueuePost);
    }

    modqueueReference = modqueueReference.limit(10);

    modqueueReference.get().then(function(modqueueDocuments) {
        $("#staffModqueue .modqueueItems").html("");

        if (modqueueDocuments.docs.length > 0) {
            modqueueDocuments.forEach(function(modqueueDocument) {
                firebase.firestore().collection("groups").doc(modqueueDocument.data().group).collection("posts").doc(modqueueDocument.data().post).get().then(function(postDocument) {
                    if (postDocument.exists) {
                        firebase.firestore().collection("users").doc(postDocument.data().author || "__NOUSER").get().then(function(userDocument) {
                            firebase.firestore().collection("groups").doc(modqueueDocument.data().group).get().then(function(groupDocument) {
                                var postContent = "";

                                if (postDocument.data().deleted) {
                                    api.approvePost({
                                        group: modqueueDocument.data().group,
                                        post: modqueueDocument.data().post
                                    });
                                    
                                    return;
                                }

                                if (postDocument.data().type == "writeup") {
                                    postContent = renderMarkdown(postDocument.data().content);
                                } else if (postDocument.data().type == "link") {
                                    postContent = renderLink(postDocument.data().content);
                                }

                                $("#staffModqueue .modqueueItems").append(
                                    $("<card class='post clickable'>")
                                        .append([
                                            $("<div class='info'>").append([
                                                $("<a class='group'>")
                                                    .attr("href", "/g/" + groupDocument.data().name)
                                                    .text("g/" + groupDocument.data().name)
                                                ,
                                                $("<span>").text(" · "),
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
                                                    .attr("href", "/g/" + groupDocument.data().name + "/posts/" + postDocument.id)
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
                                                                group: modqueueDocument.data().group,
                                                                post: modqueueDocument.data().post
                                                            });
                                                            $(this).closest("card.post").remove();

                                                            lastModqueuePost = modqueueDocument;

                                                            getStaffModqueue();
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
                                                            removedModqueueGroup = modqueueDocument.data().group;
                                                            removedModqueuePost = modqueueDocument.data().post;
                                                            lastModqueuePost = modqueueDocument;
                                                            
                                                            $("#staffRemovePostModReason").val("");
                                                            $("#staffRemovePostModError").text("");
                                                            $(".staffRemovePostModDialog")[0].showModal();
                                                            $("#staffRemovePostModReason").focus();
                                                        })
                                                ])
                                            ])
                                        ])
                                        .click(function(event) {
                                            if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                                window.open("/g/" + modqueueDocument.data().group + "/posts/" + modqueueDocument.data().post);
                                            }
                                        })
                                );
                            });
                        });
                    }
                });
            });
        } else {
            $("#staffModqueue .modqueueItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No posts to moderate right now!")),
                    $("<p>").text(_("Check back later when the modqueue has posts to review."))
                ])
            );
        }
    });
}

function getStaffReports() {
    var reportsReference = firebase.firestore().collection("reports").limit(1);

    reportsReference.get().then(function(reportsDocuments) {
        $("#staffReports .staffReportItems").html("");

        if (reportsDocuments.docs.length > 0) {
            var reportPriorities = [
                {key: "cat1", title: _("Category 1 Emergency"), class: "cat1"},
                {key: "cat2", title: _("Category 2 Emergency"), class: "cat2"},
                {key: "content", title: _("Content Removal"), class: ""},
                {key: "meta", title: _("Meta Cleanup"), class: ""}
            ];

            for (var i = 0; i < reportPriorities.length; i++) {
                $("#staffReports .staffReportItems").append(
                    $("<div class='reportPriority'>")
                        .attr("data-priority", reportPriorities[i].key)
                );
            }

            for (var i = 0; i < reportPriorities.length; i++) {
                (function(reportPriority) {
                    firebase.firestore().collection("reports")
                        .where("priority", "==", reportPriority.key)
                        .orderBy("sent", "asc")
                        .limit(5)
                        .get().then(function(reportPriorityDocuments) {
                            if (reportPriorityDocuments.docs.length > 0) {
                                $("#staffReports .staffReportItems .reportPriority[data-priority='" + reportPriority.key + "']").append(
                                    $("<h2>").text(reportPriority.title)
                                );

                                reportPriorityDocuments.forEach(function(reportPriorityDocument) {
                                    var reportedContentReference = firebase.firestore().collection("groups").doc(reportPriorityDocument.data().group).collection("posts").doc(reportPriorityDocument.data().post);
                                    
                                    if (reportPriorityDocument.data().type == "root" || reportPriorityDocument.data().type == "reply") {
                                        reportedContentReference = reportedContentReference.collection(reportPriorityDocument.data().type + "Comments").doc(reportPriorityDocument.data().comment);
                                    }

                                    reportedContentReference.get().then(function(reportedContentDocument) {
                                        firebase.firestore().collection("groups").doc(reportPriorityDocument.data().group).get().then(function(groupDocument) {
                                            firebase.firestore().collection("users").doc(reportPriorityDocument.data().reporter).get().then(function(reporterDocument) {
                                                firebase.firestore().collection("users").doc(reportedContentDocument.exists ? reportedContentDocument.data().author : "__NOUSER").get().then(function(offenderDocument) {
                                                    var excerpt = [];
                                                    var groupRuleViolation = [];
                                                    var extraDetails = [];

                                                    if (reportedContentDocument.exists) {
                                                        if (reportPriorityDocument.data().type == "post") {
                                                            excerpt = [
                                                                $("<p>").append(
                                                                    $("<a target='_blank'>")
                                                                        .attr("href", "/g/" + reportPriorityDocument.data().group + "/posts/" + reportPriorityDocument.data().post)
                                                                        .text(_("Post title: {0}", [reportedContentDocument.data().title]))
                                                                ),
                                                                $("<blockquote>").html(
                                                                    renderMarkdown(reportedContentDocument.data().content.substring(0, 300))
                                                                )
                                                            ];
                                                        } else if (reportPriorityDocument.data().type == "root" || reportPriorityDocument.data().type == "reply") {
                                                            excerpt = [
                                                                $("<p>").append(
                                                                    $("<a target='_blank'>")
                                                                        .attr("href", "/g/" + reportPriorityDocument.data().group + "/posts/" + reportPriorityDocument.data().post)
                                                                        .text(_("Comment exceprt:"))
                                                                ),
                                                                $("<blockquote>").html(
                                                                    renderMarkdown(reportedContentDocument.data().content.substring(0, 300))
                                                                )
                                                            ];
                                                        }
                                                    }

                                                    if (reportPriorityDocument.data().reason == "rules") {
                                                        groupRuleViolation = [
                                                            $("<p>").text(_("Group rule violated: {0}", [reportPriorityDocument.data().ruleTitle])),
                                                            $("<blockquote>").html(
                                                                renderMarkdown(reportPriorityDocument.data().ruleTitle)
                                                            )
                                                        ];
                                                    }

                                                    if (!!reportPriorityDocument.data().extra) {
                                                        extraDetails = [
                                                            $("<p>").text(_("Extra report details:")),
                                                            $("<blockquote>").text(reportPriorityDocument.data().extra)
                                                        ];
                                                    }

                                                    $("#staffReports .staffReportItems .reportPriority[data-priority='" + reportPriority.key + "']").append(
                                                        $("<card class='reportItem'>")
                                                            .addClass(reportPriority.class)
                                                            .append(
                                                                $("<details>").append([
                                                                    $("<summary>").text(reportTypes[reportPriorityDocument.data().reason].moderatorDescription),
                                                                    (
                                                                        reportedContentDocument.exists ?
                                                                        $("<p>").html(_("In {0} · Reported by {1} · Against {2}", [groupDocument.data().name, reporterDocument.data().username, offenderDocument.data().username])) :
                                                                        $("<p>").text(_("Certain report information is unavailable."))
                                                                    ),
                                                                    $("<p>").text(
                                                                        lang.format(reportPriorityDocument.data().sent.toDate(), lang.language, {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "numeric"
                                                                        }) + " " +
                                                                        reportPriorityDocument.data().sent.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                                                    ),
                                                                    ...excerpt,
                                                                    ...groupRuleViolation,
                                                                    ...extraDetails,
                                                                    $("<div class='buttonRow'>").append([
                                                                        $("<button class='blue'>")
                                                                            .text(_("Act"))
                                                                            .click(function() {
                                                                                actingReportId = reportPriorityDocument.id;
                                                                                actingOnStaffReport = true;

                                                                                $("#actOnReportModReason").val(reportTypes[reportPriorityDocument.data().reason].removalReason);
                                                                                $("#actOnReportModNoMessage").prop("checked", true);
                                                                                $("#actOnReportModDeleteContent").prop("checked", reportPriorityDocument.data().priority != "meta");
                                                                                $("#actOnReportModBanOffender").prop("checked", reportPriorityDocument.data().priority == "cat1" || reportPriorityDocument.data().priority == "cat2");

                                                                                $(".actOnReportModDialog")[0].showModal();
                                                                                $("#actOnReportModReason").focus();
                                                                            })
                                                                        ,
                                                                        $("<button>").text(_("Dismiss"))
                                                                            .click(function(event) {
                                                                                $(event.target).prop("disabled", true);
                                                                                $(event.target).text(_("Dismissing..."));

                                                                                api.dismissReport({
                                                                                    report: reportPriorityDocument.id
                                                                                }).then(function() {
                                                                                    getStaffReports();
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
                                });
                            }
                        })
                    ;
                })(reportPriorities[i]);
            }
        } else {
            $("#staffReports .staffReportItems").append(
                $("<div class='pageMessage middle'>").append([
                    $("<h1>").text(_("No reports to deal with right now!")),
                    $("<p>").text(_("Check back later when the report list has reports to act upon."))
                ])
            );
        }
    });
}

function finishActingOnReport() {
    var groupName;

    if (!actingOnStaffReport) {
        groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
    }

    api.dismissReport({
        group: actingOnStaffReport ? undefined : groupName,
        report: actingReportId
    }).then(function() {
        closeDialogs();

        $(".actOnReportModButton").prop("disabled", false);
        $(".actOnReportModButton").text(_("Act"));

        if (actingOnStaffReport) {
            getStaffReports();
        } else {
            getModReports();
        }
    });
}

function actOnReport() {
    var groupName;

    var noMessage = !$("#actOnReportModNoMessage").is(":checked");
    var deleteContent = $("#actOnReportModDeleteContent").is(":checked");
    var banOffender = $("#actOnReportModBanOffender").is(":checked");

    $(".actOnReportModButton").prop("disabled", true);
    $(".actOnReportModButton").text(_("Acting..."));

    var reportDocumentRef;
    
    if (actingOnStaffReport) {
        reportDocumentRef = firebase.firestore().collection("reports").doc(actingReportId);
    } else {
        groupName = trimPage(currentPage).split("/")[1].toLowerCase().trim();
        reportDocumentRef = firebase.firestore().collection("groups").doc(groupName).collection("reports").doc(actingReportId);
    }

    reportDocumentRef.get().then(function(reportDocument) {
        if (reportDocument.exists) { 
            var reportedContentReference = firebase.firestore().collection("groups").doc(actingOnStaffReport ? reportDocument.data().group : groupName).collection("posts").doc(reportDocument.data().post);
                                    
            if (reportDocument.data().type == "root" || reportDocument.data().type == "reply") {
                reportedContentReference = reportedContentReference.collection(reportDocument.data().type + "Comments").doc(reportDocument.data().comment);
            }

            reportedContentReference.get().then(function(reportedContentDocument) {
                if ($("#actOnReportModReason").val().trim() == "") {
                    $(".actOnReportModError").text(_("Please enter the reason for acting on this report."));

                    $(".actOnReportModButton").prop("disabled", false);
                    $(".actOnReportModButton").text(_("Act"));
            
                    return;
                }
            
                if ($("#actOnReportModReason").val().length > 5000) {
                    $(".actOnReportModError").text(_("The reason is too long! Please shorten it so that it's at most 5,000 characters long."));

                    $(".actOnReportModButton").prop("disabled", false);
                    $(".actOnReportModButton").text(_("Act"));
            
                    return;
                }

                if (reportDocument.data().type == "post") {
                    api.removePost({
                        group: actingOnStaffReport ? reportDocument.data().group : groupName,
                        post: reportDocument.data().post,
                        reason: $("#actOnReportModReason").val(),
                        hideMessage: noMessage || banOffender,
                        deleteContent: deleteContent
                    }).then(finishActingOnReport).catch(function(error) {
                        console.error("Glipo backend error:", error);
                
                        $(".actOnReportModError").text(_("Sorry, an internal error has occurred. Please try again later."));

                        $(".actOnReportModButton").prop("disabled", false);
                        $(".actOnReportModButton").text(_("Act"));
                    });
                } else {
                    api.removeComment({
                        group: actingOnStaffReport ? reportDocument.data().group : groupName,
                        post: reportDocument.data().post,
                        comment: reportDocument.data().comment,
                        reason: $("#actOnReportModReason").val(),
                        type: reportDocument.data().type,
                        hideMessage: noMessage || banOffender
                    }).then(finishActingOnReport).catch(function(error) {
                        console.error("Glipo backend error:", error);
                
                        $(".actOnReportModError").text(_("Sorry, an internal error has occurred. Please try again later."));

                        $(".actOnReportModButton").prop("disabled", false);
                        $(".actOnReportModButton").text(_("Act"));
                    });
                }

                if (reportedContentDocument.exists && banOffender) {
                    api.siteWideBanUser({
                        user: reportedContentDocument.data().author,
                        type: "forever", // TODO: Make this variable
                        reason: $("#actOnReportModReason").val(),
                        hideMessage: noMessage
                    }).then(finishActingOnReport).catch(function(error) {
                        console.error("Glipo backend error:", error);
                
                        $(".actOnReportModError").text(_("Sorry, an internal error has occurred. Please try again later."));

                        $(".actOnReportModButton").prop("disabled", false);
                        $(".actOnReportModButton").text(_("Act"));
                    });
                }
            });
        } else {
            finishActingOnReport();
        }
    })
}

function getStaffList() {
    firebase.firestore().collection("users").where("staff", "==", true).get().then(function(staffDocuments) {
        $("#staffMembers .staffMemberList").html("");

        $("#staffMembers .loadingSpinner").hide();
        $("#staffMembers .staffMemberList").show();

        staffDocuments.forEach(function(staffDocument) {
            $("#staffMembers .staffMemberList").append(
                $("<card class='clickable'>")
                    .append([
                        $("<a class='bold staffBadge'>")
                            .attr("href", "/u/" + staffDocument.data().username)
                            .text("u/" + staffDocument.data().username)
                        ,
                        document.createTextNode(" "),
                        $("<span>").text(staffDocument.data().staffTitle)
                    ])
                    .click(function() {
                        window.location.href = "/u/" + staffDocument.data().username;
                    })
            );
        });
    });
}

$(function() {
    if (trimPage(currentPage) == "staff") {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                firebase.firestore().collection("users").doc(user.uid).get().then(function(userDocument) {
                    if (userDocument.data().staff) {
                        $("#staffModqueue .loadingSpinner").hide();
                        $("#staffReports .loadingSpinner").hide();
                        $("#staffModqueue .modqueueItems").show();
                        $("#staffReports .staffReportItems").show();

                        getStaffModqueue();
                        getStaffReports();
                        getStaffList();
                    }
                });
            }
        });
    }
});