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

function getProfileHistory() {
    firebase.firestore().collection("usernames").doc(profileUsername).get().then(function(usernameDocument) {
        firebase.firestore().collection("users").doc(usernameDocument.data().uid).collection("posts").get().then(function(historyDocuments) {
            profileHistoryToProcess = historyDocuments.docs.length;
    
            historyDocuments.forEach(function(historyDocument) {
                firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).get().then(function(postDocument) {
                    firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection("upvoters").doc(currentUser.uid || "__NOUSER").get().then(function(upvoterDocument) {
                        firebase.firestore().collection("groups").doc(historyDocument.data().group).collection("posts").doc(historyDocument.data().post).collection("downvoters").doc(currentUser.uid || "__NOUSER").get().then(function(downvoterDocument) {
                            firebase.firestore().collection("groups").doc(historyDocument.data().group).get().then(function(groupDocument) {
                                var thisProfileHistory = postDocument.data();

                                thisProfileHistory.group = groupDocument.data().name;
                                thisProfileHistory.post = historyDocument.data().post;
                                thisProfileHistory.upvoted = upvoterDocument.exists;
                                thisProfileHistory.downvoted = downvoterDocument.exists;

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
                
                                profileHistoryToProcess--;

                                if (profileHistoryToProcess == 0) {
                                    $(".loadingPosts").hide();
                                    $(".loadedPosts").show();

                                    for (var i = 0; i < profileHistory.length; i++) {
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
                                                                .attr("aria-label", _("Comment - {0}"))
                                                                .append([
                                                                    $("<icon>").text("comment"),
                                                                    document.createTextNode(" "),
                                                                    $("<span>").text(0)
                                                                ])
                                                            ,
                                                            document.createTextNode(" "),
                                                            $("<button>")
                                                                .attr("title", _("Crosspost"))
                                                                .attr("aria-label", _("Crosspost - {0}"))
                                                                .append([
                                                                    $("<icon>").text("share"),
                                                                    document.createTextNode(" "),
                                                                    $("<span>").text(0)
                                                                ])
                                                            ,
                                                            document.createTextNode(" "),
                                                            $("<button>")
                                                                .attr("title", _("Report"))
                                                                .attr("aria-label", _("Report this post"))
                                                                .append(
                                                                    $("<icon>").text("flag")
                                                                )
                                                        ])
                                                    ])
                                                )
                                                .click(function(event) {
                                                    if (!$(event.target).closest("button, a, spoiler, card.post").is("button, a, .spoiler")) {
                                                        window.open("/g/" + thisProfileHistory.group + "/posts/" + thisProfileHistory.post + "?np=true");
                                                    }
                                                })
                                        );
                                    }
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

        $(".sort").removeClass("blue");

        if (sortMethod == "newest") {
            $(".sortNewest").addClass("blue");
        } else {
            $(".sortBest").addClass("blue");
        }

        getProfileHistory();
    }
});