/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

var reportContentType = null;
var reportContentGroup = null;
var reportContentPost = null;
var reportContentComment = null;
var reportApplicableRules = [];

function reportPost(group, post) {
    group = group.toLowerCase();

    reportContentType = "post";
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = null;

    $(".reportDescription").text(_("Report post"));
    $(".reportDescription").text(_("Tell us why you're reporting this post so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $("[name='reportType']").prop("checked", false);
    $(".reportError").html("");

    $(".reportLoaderDialog")[0].showModal();

    firebase.firestore().collection("groups").doc(group).get().then(function(groupDocument) {
        if (groupDocument.exists) {
            reportApplicableRules = groupDocument.data().rules || [];

            $(".reportGroupRule").html(_("It violates the rules of {0}", [groupDocument.data().name]));

            if (reportApplicableRules.length > 0) {
                $(".reportRuleViolationOption").show();
            } else {
                $(".reportRuleViolationOption").hide();
            }

            closeDialogs();
            $(".reportDialog")[0].showModal();
        } else {
            console.error("Group not found when trying to report content: g/" + group);

            closeDialogs();
        }
    });
}

function reportComment(group, post, comment, type) {
    group = group.toLowerCase();

    reportContentType = type;
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = comment;

    $(".reportDescription").text(_("Report comment"));
    $(".reportDescription").text(_("Tell us why you're reporting this comment so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $("[name='reportType']").prop("checked", false);
    $(".reportError").html("");

    $(".reportLoaderDialog")[0].showModal();
}

function reportBack() {
    closeDialogs();
    $(".reportDialog")[0].showModal();
}

function reportNext() {
    if ($("[name='reportType']:checked").val() != undefined) {
        $(".reportError").html("");

        $(".reportSelectedType").html($("[name='reportType']:checked").next().html());

        if ($("[name='reportType']:checked").val() == "rules") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(reportContentType == "post" ? _("Which rule in particular does this post violate?") : _("Which rule in particular does this comment violate?")),
                $("<select class='big reportSelectedTypeSuboption'>")
            ]);

            for (var i = 0; i < reportApplicableRules.length; i++) {
                $(".reportSelectedTypeForm .reportSelectedTypeSuboption").append(
                    $("<option value='spam'>").text(_("{0}. {1}", [i + 1, reportApplicableRules[i].title]))
                );
            }
        } else if ($("[name='reportType']:checked").val() == "spam") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post spammy?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='spam'>").text(_("This content has been posted multiple times")),
                    $("<option value='advertising'>").text(_("It is advertising a product in an irrelevant group")),
                    $("<option value='consumer'>").text(_("It is advertising a product which could do potential harm to buyers")),
                    $("<option value='lost'>").text(_("It has been posted in the wrong group"))
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "misinformation") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post misinformative?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='scam'>").text(_("It appears to be a con or scam operation")),
                    $("<option value='impersonation'>").text(_("It impersonates me or someone else in a misleading way")),
                    $("<option value='fake'>").text(_("It contains sensationalist or falsified information"))
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "abuse") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post abusive?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='discrimination'>").text(_("It is discrimination, a promotion of hate, prejudicial, sexist or racist")),
                    $("<option value='harassment'>").text(_("It is or incites harassment")),
                    $("<option value='violence'>").text(_("It incites violence against others")),
                    $("<option value='intimacy'>").text(_("The author is threatening to post intimate or sexually explicit content of me or someone else")),
                    $("<option value='child'>").text(_("Report a concern for child welfare")),
                    $("<option value='animal'>").text(_("Report animal abuse or neglect")),
                    $("<option value='reporting'>").text(_("The author is abusing the report functionality of Glipo"))
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "other") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("What is the issue?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='privacy'>").text(_("It contains personal or confidential information about me or someone else")),
                    $("<option value='intimacy'>").text(_("It contains intimate, sexually explicit or pornographic material")),
                    $("<option value='copyright'>").text(_("It infringes my copyright or trademark rights")),
                    $("<option value='illegal'>").text(_("It contains illegal content (such as piracy, illegal transactions or instructions for illegal activities)")),
                    $("<option value='child'>").text(_("Report a concern for child welfare")),
                    $("<option value='animal'>").text(_("Report animal abuse or neglect")),
                    $("<option value='suicide'>").text(_("Somebody is self-harming or considering suicide")),
                    $("<option value='other'>").text(_("Report an issue not covered on this list"))
                )
            ]);
        } else {
            $(".reportSelectedTypeForm").html("");
        }

        closeDialogs();
        $(".reportNextDialog")[0].showModal();
    } else {
        $(".reportError").text(_("Please select an option. If there are multiple issues, pick the most severe."));
    }
}