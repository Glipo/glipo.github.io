/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

var profileUsername = "";
var profileHistory = [];
var profileHistoryToProcess = 0;

function getSortFactor(document) {
    if (sortMethod == "newest") {
        return document.posted.toDate().getTime();
    } else {
        return document.upvotes;
    }
}

function finaliseProfileHistory() {
    $(".loadingPosts").hide();
    $(".loadedPosts").show();

    for (var i = 0; i < profileHistory.length; i++) {
        (function(i) {
            if (profileHistory[i].historyType == "post") {
                var postContent = "";
    
                if (profileHistory[i].type == "writeup") {
                    postContent = renderMarkdown(profileHistory[i].content);
                } else if (profileHistory[i].type == "link") {
                    postContent = renderLink(profileHistory[i].content);
                }
    
                $(".loadedPosts").append(
                    $("<card class='post clickable'>")
                        .append(
                            $("<div class='info'>").append([
                                $("<a class='group'>")
                                    .attr("href", "/g/" + profileHistory[i].group)
                                    .text("g/" + profileHistory[i].group)
                                ,
                                $("<span>").text(" · "),
                                $("<span>")
                                    .attr("title",
                                        lang.format(profileHistory[i].posted.toDate(), lang.language, {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        }) + " " +
                                        profileHistory[i].posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                    )
                                    .text(timeDifferenceToHumanReadable(new Date().getTime() - profileHistory[i].posted.toDate().getTime()))
                            ]),
                            $("<h2 class='title'>").append(
                                $("<a>")
                                    .attr("href", "/g/" + profileHistory[i].group + "/posts/" + profileHistory[i].post)
                                    .attr("target", "_blank")
                                    .text(profileHistory[i].title)
                            ),
                            $("<div class='postContent'>")
                                .addClass(profileHistory[i].type)
                                .html(postContent)
                            ,
                            $("<div class='actions'>").append([
                                $("<div>").append([
                                    $("<button class='upvoteButton'>")
                                        .attr("title", _("Votes cannot be cast when viewing user profiles"))
                                        .attr("aria-label", _("Upvote - {0}", [profileHistory[i].upvotes]))
                                        .prop("disabled", true)
                                        .addClass(profileHistory[i].upvoted ? "yellow" : "")
                                        .append([
                                            $("<icon>").text("arrow_upward"),
                                            document.createTextNode(" "),
                                            $("<span>").text(profileHistory[i].upvotes)
                                        ])
                                    ,
                                    document.createTextNode(" "),
                                    $("<button class='downvoteButton'>")
                                        .attr("title", _("Votes cannot be cast when viewing user profiles"))
                                        .attr("aria-label", _("Downvote - {0}", [profileHistory[i].downvotes]))
                                        .prop("disabled", true)
                                        .addClass(profileHistory[i].downvoted ? "blue" : "")
                                        .append([
                                            $("<icon>").text("arrow_downward"),
                                            document.createTextNode(" "),
                                            $("<span>").text(profileHistory[i].downvotes)
                                        ])
                                ]),
                                $("<div class='desktop'>").append([
                                    $("<button>")
                                        .attr("title", _("Comment"))
                                        .attr("aria-label", _("Comment - {0}", [profileHistory[i].comments || 0]))
                                        .append([
                                            $("<icon>").text("comment"),
                                            document.createTextNode(" "),
                                            $("<span>").text(profileHistory[i].comments || 0)
                                        ])
                                        .click(function() {
                                            window.open("/g/" + profileHistory[i].group + "/posts/" + profileHistory[i].post + "?np=true");
                                        })
                                    ,
                                    document.createTextNode(" "),
                                    $("<button>")
                                        .attr("title", _("Crosspost"))
                                        .attr("aria-label", _("Crosspost - {0}", [0]))
                                        .append([
                                            $("<icon>").text("share"),
                                            document.createTextNode(" "),
                                            $("<span>").text(0)
                                        ])
                                    ,
                                    document.createTextNode(" "),
                                    $("<button>")
                                        .attr("title", _("Report"))
                                        .attr("aria-label", _("Report"))
                                        .append(
                                            $("<icon>").text("flag")
                                        )
                                ])
                            ])
                        )
                        .click(function(event) {
                            if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                window.open("/g/" + profileHistory[i].group + "/posts/" + profileHistory[i].post + "?np=true");
                            }
                        })
                );
            } else if (profileHistory[i].historyType == "comment") {
                $(".loadedPosts").append(
                    $("<card class='post clickable'>")
                        .append(
                            $("<div class='info'>").append([
                                $("<a class='group'>")
                                    .attr("href", "/g/" + profileHistory[i].group)
                                    .text("g/" + profileHistory[i].group)
                                ,
                                $("<span>").text(" · "),
                                $("<span>")
                                    .attr("title",
                                        lang.format(profileHistory[i].posted.toDate(), lang.language, {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        }) + " " +
                                        profileHistory[i].posted.toDate().toLocaleTimeString(lang.language.replace(/_/g, "-"))
                                    )
                                    .text(timeDifferenceToHumanReadable(new Date().getTime() - profileHistory[i].posted.toDate().getTime()))
                            ]),
                            $("<div class='postContent'>").html(renderMarkdown(profileHistory[i].content)),
                            $("<div class='actions'>").append([
                                $("<div>").append([
                                    $("<button class='upvoteButton'>")
                                        .attr("title", _("Votes cannot be cast when viewing user profiles"))
                                        .attr("aria-label", _("Upvote - {0}", [profileHistory[i].upvotes]))
                                        .prop("disabled", true)
                                        .addClass(profileHistory[i].upvoted ? "yellow" : "")
                                        .append([
                                            $("<icon>").text("arrow_upward"),
                                            document.createTextNode(" "),
                                            $("<span>").text(profileHistory[i].upvotes)
                                        ])
                                    ,
                                    document.createTextNode(" "),
                                    $("<button class='downvoteButton'>")
                                        .attr("title", _("Votes cannot be cast when viewing user profiles"))
                                        .attr("aria-label", _("Downvote - {0}", [profileHistory[i].downvotes]))
                                        .prop("disabled", true)
                                        .addClass(profileHistory[i].downvoted ? "blue" : "")
                                        .append([
                                            $("<icon>").text("arrow_downward"),
                                            document.createTextNode(" "),
                                            $("<span>").text(profileHistory[i].downvotes)
                                        ])
                                ]),
                                $("<div class='desktop'>").append([
                                    $("<button>")
                                        .attr("aria-label", _("Reply"))
                                        .append([
                                            $("<icon>").text("reply"),
                                            document.createTextNode(" "),
                                            $("<span>").text(_("Reply"))
                                        ])
                                        .click(function() {
                                            window.open("/g/" + encodeURIComponent(profileHistory[i].group) + "/posts/" + encodeURIComponent(profileHistory[i].post) + "?comment=" + encodeURIComponent(profileHistory[i].comment) + "&commentType=" + encodeURIComponent(profileHistory[i].commentType) + "&np=true");
                                        })
                                    ,
                                    document.createTextNode(" "),
                                    $("<button>")
                                        .attr("title", _("Report"))
                                        .attr("aria-label", _("Report"))
                                        .append(
                                            $("<icon>").text("flag")
                                        )
                                ])
                            ])
                        )
                        .click(function(event) {
                            if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                window.open("/g/" + encodeURIComponent(profileHistory[i].group) + "/posts/" + encodeURIComponent(profileHistory[i].post) + "?comment=" + encodeURIComponent(profileHistory[i].comment) + "&commentType=" + encodeURIComponent(profileHistory[i].commentType) + "&np=true");
                            }
                        })
                );
            }
        })(i);
    }
}

function getProfileHistory() {
    firebase.firestore().collection("usernames").doc(profileUsername).get().then(function(usernameDocument) {
        firebase.firestore().collection("users").doc(usernameDocument.data().uid).collection("posts").get().then(function(historyDocuments) {
            profileHistoryToProcess += historyDocuments.docs.length;
    
            historyDocuments.forEach(function(historyDocument) {
                firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).get().then(function(postDocument) {
                    firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                        firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                            firebase.firestore().collection("groups").doc(historyDocument.data().group).get().then(function(groupDocument) {
                                var thisProfileHistory = postDocument.data();

                                thisProfileHistory.historyType = "post";
                                thisProfileHistory.group = groupDocument.data().name;
                                thisProfileHistory.post = historyDocument.data().post;
                                thisProfileHistory.upvoted = upvoterDocument.exists;
                                thisProfileHistory.downvoted = downvoterDocument.exists;

                                if (!thisProfileHistory.deleted) {
                                    if (profileHistory.length > 0) {
                                        for (var i = 0; i < profileHistory.length; i++) {
                                            if (getSortFactor(thisProfileHistory) > getSortFactor(profileHistory[i])) {
                                                profileHistory.splice(i, 0, thisProfileHistory);
                    
                                                break;
                                            } else if (i + 1 == profileHistory.length) {
                                                profileHistory.push(thisProfileHistory);

                                                break;
                                            }
                                        }
                                    } else {
                                        profileHistory.push(thisProfileHistory);
                                    }
                                }

                                profileHistoryToProcess--;

                                if (profileHistoryToProcess == 0) {
                                    finaliseProfileHistory();
                                }
                            });
                        });
                    });
                });
            });
        });

        firebase.firestore().collection("users").doc(usernameDocument.data().uid).collection("comments").get().then(function(historyDocuments) {
            profileHistoryToProcess += historyDocuments.docs.length;
    
            historyDocuments.forEach(function(historyDocument) {
                firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection(historyDocument.data().type + "Comments").doc(historyDocument.data().comment).get().then(function(commentDocument) {
                    firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection(historyDocument.data().type + "Comments").doc(historyDocument.data().comment).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                        firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection(historyDocument.data().type + "Comments").doc(historyDocument.data().comment).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                            firebase.firestore().collection("groups").doc(historyDocument.data().group).get().then(function(groupDocument) {
                                var thisProfileHistory = commentDocument.data();

                                thisProfileHistory.historyType = "comment";
                                thisProfileHistory.group = groupDocument.data().name;
                                thisProfileHistory.post = historyDocument.data().post;
                                thisProfileHistory.comment = historyDocument.data().comment;
                                thisProfileHistory.commentType = historyDocument.data().type;
                                thisProfileHistory.upvoted = upvoterDocument.exists;
                                thisProfileHistory.downvoted = downvoterDocument.exists;

                                if (!thisProfileHistory.deleted) {
                                    if (profileHistory.length > 0) {
                                        for (var i = 0; i < profileHistory.length; i++) {
                                            if (getSortFactor(thisProfileHistory) > getSortFactor(profileHistory[i])) {
                                                profileHistory.splice(i, 0, thisProfileHistory);
                    
                                                break;
                                            } else if (i + 1 == profileHistory.length) {
                                                profileHistory.push(thisProfileHistory);

                                                break;
                                            }
                                        }
                                    } else {
                                        profileHistory.push(thisProfileHistory);
                                    }
                                }
                
                                profileHistoryToProcess--;

                                if (profileHistoryToProcess == 0) {
                                    finaliseProfileHistory();
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

$(function() {
    if (currentPage.startsWith("u/") && trimPage(currentPage).split("/").length > 1) {
        profileUsername = trimPage(currentPage).split("/")[1].toLowerCase().trim();

        if (["newest", "best"].includes(core.getURLParameter("sort"))) {
            sortMethod = core.getURLParameter("sort");
        } else {
            sortMethod = "newest";
        }

        $(".sort")
            .removeClass("blue")
            .attr("aria-label", null)
        ;

        if (sortMethod == "best") {
            $(".sortBest")
                .addClass("blue")
                .attr("aria-label", _("{0} - Selected", [_("Best")]))
            ;
        } else {
            $(".sortNewest")
                .addClass("blue")
                .attr("aria-label", _("{0} - Selected", [_("Newest")]))
            ;
        }

        getProfileHistory();
    }
});