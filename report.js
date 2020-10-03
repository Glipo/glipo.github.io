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

var reportTypes = {
    suicide: {
        priority: "cat1",
        userDescription: _("Somebody is self-harming or considering suicide"),
        moderatorDescription: _("Suicide/self-harm report"),
        removalReason: _("Please contact Glipo so that our team can help make your situation improve: hi@glipo.net")
    },
    violence: {
        priority: "cat1",
        userDescription: _("It incites violence against others"),
        moderatorDescription: _("Violence against another user"),
        removalReason: _("Causing violence to others or inciting violence on Glipo is strictly forbidden.")
    },
    child: {
        priority: "cat1",
        userDescription: _("Report a concern for child welfare"),
        moderatorDescription: _("Child welfare concern report"),
        removalReason: _("Posting content of child abuse or neglect is strictly forbidden on Glipo. Glipo's staff may have contacted relevant child protection authorities concerning the content that you have posted.")
    },
    animal: {
        priority: "cat1",
        userDescription: _("Report animal abuse or neglect"),
        moderatorDescription: _("Animal abuse/neglect report"),
        removalReason: _("Posting content of animal abuse or neglect is strictly fobidden on Glipo. Glipo's staff may have contacted relevant animal protection authorities concerning the content that you have posted.")
    },
    illegal: {
        priority: "cat1",
        userDescription: _("It contains illegal content (such as piracy, illegal transactions or instructions for illegal activities)"),
        moderatorDescription: _("Illegal content"),
        removalReason: _("Content which contains illegal information (such as piracy, faciliation of illegal transactions or incitement of illegal activity) is strictly forbidden on Glipo. Relevant authorites may have been contacted by Glipo's staff.")
    },
    harassment: {
        priority: "cat2",
        userDescription: _("It is or incites harassment"),
        moderatorDescription: _("Harassment against another user"),
        removalReason: _("Harassment or incitement of harassment against another user on Glipo (such as stalking or revealing the personal or confidential information of anyone) is strictly forbidden.")
    },
    intimacy: {
        priority: "cat2",
        userDescription: _("The author is threatening to post intimate or sexually explicit content of me or someone else"),
        alternativeUserDescriptions: [_("It contains intimate, sexually explicit or pornographic material")],
        moderatorDescription: _("Intimate/sexually explicit content"),
        removalReason: _("Intimate, sexually explicit or pornographic material is strictly forbidden on Glipo. Additionally, threatening to post such material is also forbidden. If sexual or suggestive content that involves children under the age of 18 years is posted or incited on Glipo, staff members may contact relevant authorities.")
    },
    impersonation: {
        priority: "cat2",
        userDescription: _("It impersonates me or someone else in a misleading way"),
        moderatorDescription: _("Impersonation of an entity"),
        removalReason: _("Impersonation of others in a misleading way is not allowed on Glipo.")
    },
    privacy: {
        priority: "cat2",
        userDescription: _("It contains personal or confidential information about me or someone else"),
        moderatorDescription: _("Personal/confidential information disclosure"),
        removalReason: _("The disclosure of personal or confidential information about yourself or others is not allowed on Glipo.")
    },
    consumer: {
        priority: "cat2",
        userDescription: _("It is advertising a product which could do potential harm to buyers"),
        moderatorDescription: _("Advertising of product which may cause potential harm"),
        removalReason: _("Advertising a product which may cause potential harm to buyers is strictly forbidden on Glipo. Glipo's staff may have contacted relevant authorities.")
    },
    scam: {
        priority: "content",
        userDescription: _("It appears to be a con or scam operation"),
        moderatorDescription: _("Con/scam operation"),
        removalReason: _("Con or scam operations are strictly forbidden on Glipo. Glipo's staff may have contacted relevant authorities.")
    },
    discrimination: {
        priority: "content",
        userDescription: _("It is discrimination, a promotion of hate, prejudicial, sexist or racist"),
        moderatorDescription: _("Discrimination, promotion of hate, prejudice, sexism or racism"),
        removalReason: _("Discrimination, promotions of hate, prejudice, sexism and racism is unwelcome on Glipo and strong safeguards are in place to prevent this.")
    },
    copyright: {
        priority: "content",
        userDescription: _("It infringes my copyright or trademark rights"),
        moderatorDescription: _("Copyright/trademark violation"),
        removalReason: _("Posting content that infringes copyright or trademarks is not allowed on Glipo.")
    },
    fake: {
        priority: "content",
        userDescription: _("It contains sensationalist or falsified information"),
        moderatorDescription: _("Sensationalist/falsified information"),
        removalReason: _("Sensationalist and falsified information is not allowed on Glipo.")
    },
    spam: {
        priority: "meta",
        userDescription: _("This content has been posted multiple times"),
        moderatorDescription: _("Spam of content that has been posted multiple times"),
        removalReason: _("Please do not spam content that has been posted multiple times on Glipo.")
    },
    reporting: {
        priority: "meta",
        userDescription: _("The author is abusing the report functionality of Glipo"),
        moderatorDescription: _("Abuse of report functionality"),
        removalReason: _("Please do not abuse the report functionality of Glipo; this prevents us from being able to act upon more serious reports.")
    },
    lost: {
        priority: "meta",
        userDescription: _("It has been posted in the wrong group"),
        moderatorDescription: _("Content posted to wrong group"),
        removalReason: _("It appears that you posted this in the wrong group. Next time, make sure that you choose the right group before posting again.")
    },
    advertising: {
        priority: "meta",
        userDescription: _("It is advertising a product in an irrelevant group"),
        moderatorDescription: _("Unsolicited advertising/advertising to wrong group"),
        removalReason: _("Unsolicited advertising is unwelcome on Glipo. Advertising in irrelevant groups is also not allowed.")
    },
    rules: {
        priority: "meta",
        userDescription: _("It breaks the rules of the group that it was posted in"),
        moderatorDescription: _("Group rule violation"),
        removalReason: _("Your content appears to have violated the rules of the group it was posted in. Please read the rules of groups first before posting to them.")
    },
    other: {
        priority: "meta",
        userDescription: _("Report an issue not covered on this list"),
        moderatorDescription: _("Other issue"),
        removalReason: ""
    }
};

function reportPost(group, post) {
    if (currentUser.uid == null) {
        switchToSignUpDialog();

        return;
    }

    group = group.toLowerCase();

    reportContentType = "post";
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = null;

    $(".reportTitle").text(_("Report post"));
    $(".reportDescription").text(_("Tell us why you're reporting this post so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $("[name='reportType']").prop("checked", false);
    $(".reportExtra").val("");
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
    if (currentUser.uid == null) {
        switchToSignUpDialog();

        return;
    }

    group = group.toLowerCase();

    reportContentType = type;
    reportContentGroup = group;
    reportContentPost = post;
    reportContentComment = comment;

    $(".reportTitle").text(_("Report comment"));
    $(".reportDescription").text(_("Tell us why you're reporting this comment so that we can further investigate the issue."));
    $(".reportGroupRule").html(_("It violates the rules of {0}", [group]));

    $("[name='reportType']").prop("checked", false);
    $(".reportExtra").val("");
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
                    $("<option>")
                        .attr("value", i)
                        .text(_("{0}. {1}", [i + 1, reportApplicableRules[i].title]))
                );
            }
        } else if ($("[name='reportType']:checked").val() == "spam") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post spammy?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='spam'>").text(reportTypes.spam.userDescription),
                    $("<option value='advertising'>").text(reportTypes.advertising.userDescription),
                    $("<option value='consumer'>").text(reportTypes.consumer.userDescription),
                    $("<option value='lost'>").text(reportTypes.lost.userDescription)
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "misinformation") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post misinformative?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='scam'>").text(reportTypes.scam.userDescription),
                    $("<option value='impersonation'>").text(reportTypes.impersonation.userDescription),
                    $("<option value='fake'>").text(reportTypes.fake.userDescription)
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "abuse") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("Why is this post abusive?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='discrimination'>").text(reportTypes.discrimination.userDescription),
                    $("<option value='harassment'>").text(reportTypes.harassment.userDescription),
                    $("<option value='violence'>").text(reportTypes.violence.userDescription),
                    $("<option value='intimacy'>").text(reportTypes.intimacy.userDescription),
                    $("<option value='child'>").text(reportTypes.child.userDescription),
                    $("<option value='animal'>").text(reportTypes.animal.userDescription),
                    $("<option value='reporting'>").text(reportTypes.reporting.userDescription)
                )
            ]);
        } else if ($("[name='reportType']:checked").val() == "other") {
            $(".reportSelectedTypeForm").html("").append([
                $("<p>").text(_("What is the issue?")),
                $("<select class='big reportSelectedTypeSuboption'>").append(
                    $("<option value='privacy'>").text(reportTypes.privacy.userDescription),
                    $("<option value='intimacy'>").text(reportTypes.intimacy.alternativeUserDescriptions[0]),
                    $("<option value='copyright'>").text(reportTypes.copyright.userDescription),
                    $("<option value='illegal'>").text(reportTypes.illegal.userDescription),
                    $("<option value='child'>").text(reportTypes.child.userDescription),
                    $("<option value='animal'>").text(reportTypes.animal.userDescription),
                    $("<option value='suicide'>").text(reportTypes.suicide.userDescription),
                    $("<option value='other'>").text(reportTypes.other.userDescription)
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

function reportSend() {
    if ($(".reportExtra").val().trim().length > 1000) {
        $(".reportError").text(_("Your extra report information is too long! Please shorten it so it's at most 2,000 characters long."));

        return;
    }

    $(".reportSendButton").prop("disabled", true);
    $(".reportSendButton").text(_("Sending..."));

    console.log();

    api.reportContent({
        type: reportContentType,
        group: reportContentGroup,
        post: reportContentPost,
        reason: $("[name='reportType']:checked").val() == "rules" ? "rules" : $(".reportSelectedTypeSuboption option:selected").val(),
        rule: $("[name='reportType']:checked").val() == "rules" ? Number($(".reportSelectedTypeSuboption option:selected").val()) : undefined,
        comment: reportContentComment != null ? reportContentComment : undefined,
        extra: $(".reportExtra").val().trim()
    }).then(function() {
        $(".reportSendButton").prop("disabled", false);
        $(".reportSendButton").text(_("Send"));

        closeDialogs();
        $(".reportThanksDialog")[0].showModal();
    }).catch(function(error) {
        console.error("Glipo backend error:", error);
        
        $(".reportError").text(_("Sorry, an internal error has occurred. Please try sending your report again later."));
        $(".reportSendButton").prop("disabled", false);
        $(".reportSendButton").text(_("Send"));
    });
}