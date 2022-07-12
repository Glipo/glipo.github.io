<!DOCTYPE html>
<!-- saved from url=(0026)https://glipo.net/settings -->
<html dir="ltr"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Settings - Glipo</title>
        
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=3">
        <meta name="description" content="Join Glipo today, the network that connects communities through the internet. We&#39;ve got stories, photos, memes, tips, tricks and more!">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="Glipo">
        <link rel="apple-touch-icon" sizes="180x180" href="https://glipo.net/media/icons/apple-touch-icon.png">
        <link rel="shortcut icon" href="./Settings - Glipo_files/small.png">
        <link rel="manifest" href="https://glipo.net/manifest.json">
        <link rel="stylesheet" href="./Settings - Glipo_files/dialog-polyfill.css">
        <link rel="stylesheet" href="./Settings - Glipo_files/font.css">
        <link rel="stylesheet" href="./Settings - Glipo_files/style.css">
        <script type="text/javascript" async="" src="./Settings - Glipo_files/js"></script><script src="./Settings - Glipo_files/dialog-polyfill.js"></script>
        <script src="./Settings - Glipo_files/jquery.min.js"></script>
        <script src="./Settings - Glipo_files/showdown.min.js"></script>
        <script src="./Settings - Glipo_files/firebase-app.js"></script>
        <script src="./Settings - Glipo_files/firebase-analytics.js"></script>
        <script src="./Settings - Glipo_files/firebase-auth.js"></script>
        <script src="./Settings - Glipo_files/firebase-firestore.js"></script>
        <script src="./Settings - Glipo_files/firebase-functions.js"></script>
        <script src="./Settings - Glipo_files/firebase-storage.js"></script>
        <script src="./Settings - Glipo_files/firebase-messaging.js"></script>
        <script src="./Settings - Glipo_files/core.js"></script>
        <script src="./Settings - Glipo_files/lang.js"></script>
        <script src="./Settings - Glipo_files/pages.js"></script>
        <script src="./Settings - Glipo_files/mdRenderer.js"></script>
        <script src="./Settings - Glipo_files/ce.js"></script>
        <script src="./Settings - Glipo_files/upload.js"></script>
        <script src="./Settings - Glipo_files/script.js"></script><script src="./Settings - Glipo_files/js(1)" async=""></script>
        <script src="./Settings - Glipo_files/api.js"></script>
        <script src="./Settings - Glipo_files/posts.js"></script>
        <script src="./Settings - Glipo_files/profilePosts.js"></script>
        <script src="./Settings - Glipo_files/post.js"></script>
        <script src="./Settings - Glipo_files/messages.js"></script>
        <script src="./Settings - Glipo_files/staff.js"></script>
        <script src="./Settings - Glipo_files/moderators.js"></script>
        <script src="./Settings - Glipo_files/report.js"></script>
        <script src="./Settings - Glipo_files/en_GB.js"></script>
    </head>
    <body>
        <a class="skipTo" href="https://glipo.net/settings#content">Skip to content</a>
        <a class="skipTo" href="https://glipo.net/settings#sidebar">Skip to sidebar</a>
        <nav>
            <a href="https://glipo.net/" class="logo">
                <img src="./Settings - Glipo_files/largeWhite.png" alt="Glipo" class="desktop">
                <img src="./Settings - Glipo_files/small.png" alt="Glipo" class="mobile">
            </a>
            <div class="search">
                <input placeholder="Search">
                <icon aria-hidden="true">search</icon>
            </div>
            <button onclick="toggleMenu();" class="location desktop">
                <span class="currentLocation">Settings</span>
                <icon aria-hidden="true" class="locationDropdownIndicator">arrow_drop_down</icon>
            </button>
            <span class="signedIn" style="display: inline;">
                <button title="Notifications" onclick="window.location.href = &#39;/notifications&#39;;" class="menuButton menuButtonHalf notificationsButton"><icon aria-label="Notifications">notifications</icon></button>
                <button title="Sign out" onclick="signOut();" class="menuButton menuButtonHalf"><icon aria-label="Sign out" class="flippable">exit_to_app</icon></button>
            </span>
            <span class="signedOut" style="display: none;">
                <button onclick="showSignInDialog();" class="menuButton menuButtonBig blue">Sign in</button>
            </span>
            <button onclick="toggleMenu();" class="menuButton menuButtonSmall"><icon aria-label="Open/close menu">menu</icon></button>
        </nav>
        <div class="menu" style="display: none;">
            <div class="forMenuButtonSmall">
                <div class="signedIn" style="display: block;">
                    <button onclick="window.location.href = &#39;/notifications&#39;;">Notifications</button>
                    <button onclick="signOut();">Sign out</button>
                </div>
                <div class="signedOut" style="display: none;">
                    <button onclick="showSignInDialog();">Sign in</button>
                    <button onclick="showSignUpDialog();">Sign up</button>
                </div>
            </div>
            <div class="mobile">
                <button onclick="window.location.href = &#39;/about&#39;;">About Glipo</button>
            </div>
            <div class="signedIn" style="display: block;">
                <button onclick="window.location.href = &#39;/settings&#39;;">Settings</button>
                <div class="isStaff" style="display: none;">
                    <button onclick="window.location.href = &#39;/staff&#39;;">Staff area</button>
                </div>
                <div class="canCreateGroups" style="display: none;">
                    <button onclick="window.location.href = &#39;/creategroup&#39;;">Create a group</button>
                </div>
                <hr>
            </div>
            <button onclick="window.location.href = &#39;/&#39;;">Feed</button>
            <div class="signedIn" style="display: block;">
                <button onclick="visitUserProfile();">u/<span class="currentUsername">cmruparell</span></button>
            </div>
            <div class="joinedGroups"><hr><button>g/glipo</button></div>
        </div>
        <header data-location="^g\/[^\/]+$" style="display: none;">
            <h1 class="groupName"></h1>
            <p class="groupDescription"></p>
            <span class="mobile">
                <span class="pageExistent">
                    <details>
                        <summary><span>Group info</span> <button onclick="toggleGroupMembership();" class="floatEnd blue groupJoinButton">Join</button></summary>
                        <p><strong class="groupMemberCount">--- members</strong></p>
                        <p class="groupPostCount">--- posts</p>
                        <p class="groupCommentCount">--- comments</p>
                        <button class="big visitGroupRules">View group rules</button>
                        <span class="signedIn" style="display: inline;">
                            <span class="isModerator" style="display: none;">
                                <button onclick="visitModeratorTools();" class="big">Moderator tools</button>
                            </span>
                            <span class="isNotModerator" style="display: inline;">
                                <button onclick="visitModmailSender();" class="big">Message moderators</button>
                            </span>
                        </span>
                    </details>
                </span>
            </span>
        </header>
        <main id="content" style="outline: none;">
            <span class="error404">
                <section class="posts pageMessage middle">
                    <h1>A bit lost?</h1>
                    <p>The page that you requested was not found.</p>
                    <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    <div class="spacer"></div>
                    <small>404</small>
                </section>
            </span>
            <section class="posts" data-location="^g\/[^\/]+$|^\/$" style="display: none;"> <!-- Feed and group page -->
                <div data-location="^/$" style="display: none;"> <!-- Feed page only -->
                    <div class="mobile">
                        <div class="signedOut" style="display: none;">
                            <card data-location="^g\/[^\/]+$|^\/$" style="display: none;">
                                <h1>Welcome to Glipo</h1>
                                <p>Glipo is a social network where you can discover your community through our groups.</p>
                                <button onclick="showSignUpDialog();" class="big blue">Sign up</button>
                            </card>
                        </div>
                    </div>
                </div>
                <div class="pageExistent">
                    <card class="sorts">
                        <button onclick="sortPostsBy(&#39;popular&#39;);" aria-label="Popular" class="sort sortPopular"><icon aria-hidden="true">whatshot</icon> <span>Popular</span></button>
                        <button onclick="sortPostsBy(&#39;best&#39;);" aria-label="Best" class="sort sortBest"><icon aria-hidden="true">bar_chart</icon> <span>Best</span></button>
                        <button onclick="sortPostsBy(&#39;newest&#39;);" aria-label="Newest" class="sort sortNewest"><icon aria-hidden="true">new_releases</icon> <span>Newest</span></button>
                        <button onclick="visitSubmitPost();" class="newPost yellow floatEnd"><icon aria-hidden="true">add</icon> <span>New post</span></button>
                    </card>
                    <card class="searchSiteWidePrompt">
                        <p>Looking for something that's a bit less specific? We can search for posts that are outside of this group, too!</p>
                        <div class="buttonRow">
                            <button onclick="searchSiteWide();" class="blue">Search the whole site</button>
                        </div>
                    </card>
                    <div class="loadingPosts">
                        <div class="loadingSpinner"></div>
                    </div>
                    <div class="loadedGroupResults">
                        <h1>Groups</h1>
                    </div>
                    <div class="loadedUserResults">
                        <h1>Users</h1>
                    </div>
                    <div class="loadedPostsHeader">
                        <h1>Posts</h1>
                    </div>
                    <div class="loadedPosts"></div>
                    <div class="noPosts pageMessage middle">
                        <h1>Give this group its very first post</h1>
                        <p>Get started by writing this group's first ever post. It'll be monumental!</p>
                        <button onclick="visitSubmitPost();" class="blue">Write a post</button>
                    </div>
                    <div class="noResults pageMessage middle">
                        <h1>We can't find what you're looking for</h1>
                        <p>There doesn't seem to be any posts that match your search term. Maybe try searching for something different!</p>
                        <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    </div>
                </div>
                <div class="pageNonExistent pageMessage middle">
                    <h1>This group doesn't exist!</h1>
                    <p>Check to see if you entered the group name correctly. If you want to create a group with this name, go ahead!</p>
                    <button onclick="visitCreateGroup();" class="blue">Create a group</button>
                </div>
            </section>
            <section class="posts" data-location="^g\/[^\/]+\/posts\/[^\/]+$" style="display: none;"> <!-- Opened post page -->
                <div class="loadingPosts">
                    <div class="loadingSpinner"></div>
                </div>
                <div class="loadedPosts">
                    <card class="transparent noPadding">
                        <button onclick="window.close(); window.history.back();" class="transparent">
                            <icon aria-hidden="true" class="flippable">arrow_back</icon>
                            <span>Back</span>
                        </button>
                    </card>
                    <div class="editPost">
                        <input placeholder="Post title" class="big" id="editPostTitle">
                        <div class="editPostWriteup">
                            <div class="contentEditor"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                        </div>
                        <div class="editPostOther">
                            <p class="middle">The contents of this post cannot be changed as this post is not a writeup.</p>
                        </div>
                        <p class="errorMessage" id="editPostError"></p>
                        <div class="buttonRow paddingBottom">
                            <button class="blue editPostSubmitButton">Edit</button>
                            <button class="editPostCancelButton">Cancel</button>
                            <button class="editPostDeleteButton desktop">Delete post</button>
                            <button class="editPostDeleteButton mobile"><icon>delete</icon></button>
                        </div>
                    </div>
                    <card class="post">
                        <div class="info">
                            <a class="group postGroup"></a>
                            <span>·</span>
                            <span class="postAuthor"></span>
                            <span>·</span>
                            <span class="postTimestamp"></span>
                            <span class="postIsEdited">
                                <span>·</span>
                                <span class="postEditTime">Edited</span>
                            </span>
                        </div>
                        <h1 class="postTitle"></h1>
                        <div class="postContent fullContent"></div>
                        <div class="actions">
                            <div>
                                <button title="Upvote" aria-label="Upvote" class="upvoteButton postUpvoteButton">
                                    <icon>arrow_upward</icon>
                                    <span class="postUpvotes">Up</span>
                                </button>
                                <button title="Downvote" aria-label="Downvote" class="downvoteButton postDownvoteButton">
                                    <icon>arrow_downward</icon>
                                    <span class="postDownvotes">Down</span>
                                </button>
                            </div>
                            <div>
                                <button title="Crosspost" aria-label="Crosspost" class="postCrosspostButton">
                                    <icon>share</icon>
                                    <span class="postCrossposts">0</span>
                                </button>
                                <span class="postAuthoredByMe">
                                    <button title="Edit or delete" aria-label="Edit or delete" class="editPostButton">
                                        <icon>edit</icon>
                                    </button>
                                </span>
                                <span class="postNotAuthoredByMe">
                                    <button title="Report" aria-label="Report" class="reportPostButton">
                                        <icon>flag</icon>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </card>
                    <card class="informational hidden postDeleted">
                        <strong>This post has been deleted by its author.</strong>
                        <span>The comments on this post have been kept for informational purposes.</span>
                    </card>
                    <card class="informational hidden postStaffRemoved">
                        <strong>This post has been removed by staff because it violates the rules of Glipo's Content Policy.</strong>
                        <span>Votes can still be cast, but they will not affect the ranking of this post.</span>
                    </card>
                    <card class="informational hidden postModeratorRemoved">
                        <strong>This post has been removed by a moderator as it violates the rules of this group.</strong>
                        <span>Votes can still be cast, but they will not affect the ranking of this post.</span>
                    </card>
                    <card class="transparent noPadding">
                        <div class="signedIn" style="display: block;">
                            <button onclick="openRootCommentCe();" aria-label="New comment" class="ceSummoner" style="display: inline-block;">Write a comment...</button>
                            <div class="ceUnsummoned" style="display: none;">
                                <div class="writeComment contentEditor"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                                <div class="buttonRow">
                                    <button onclick="writeComment();" class="blue" id="writeCommentButton">Post</button>
                                    <button onclick="ceUnsummon();">Cancel</button>
                                </div>
                                <p class="errorMessage" id="writeCommentError"></p>
                            </div>
                        </div>
                        <div class="signedOut" style="display: none;">
                            <button onclick="showSignUpDialog();" class="ceSummoner" style="display: inline-block;">Sign up to write a comment...</button>
                        </div>
                    </card>
                    <card class="sorts">
                        <button onclick="sortPostsBy(&#39;best&#39;);" aria-label="Best" class="sort sortBest blue"><icon aria-hidden="true">bar_chart</icon> <span>Best</span></button>
                        <button onclick="sortPostsBy(&#39;newest&#39;);" aria-label="Newest" class="sort sortNewest"><icon aria-hidden="true">new_releases</icon> <span>Newest</span></button>
                    </card>
                    <div class="postComments"></div>
                    <button onclick="showMoreComments();" class="showMoreComments">Show more comments (0 remaining)</button>
                </div>
                <div class="pageNonExistent middle">
                    <div class="pageMessage">
                        <h1>Which post were you talking about?!</h1>
                        <p>It seems that no post exists with this link; check to see if the address is correct.</p>
                        <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^g\/[^\/]+\/rules$" style="display: none;"> <!-- Group rules page -->
                <div class="loadingRules">
                    <div class="loadingSpinner"></div>
                </div>
                <div class="pageExistent">
                    <div class="loadedRules">
                        <card class="transparent noPadding">
                            <button onclick="window.close(); window.history.back();" class="transparent">
                                <icon aria-hidden="true" class="flippable">arrow_back</icon>
                                <span>Back</span>
                            </button>
                        </card>
                            <card class="post">
                                <h1 class="groupRulesHeader">Group rules</h1>
                                <div class="hasRules">
                                    <div class="groupRules"></div>
                                </div>
                                <div class="hasNoRules">
                                    <p>This group doesn't have any rules! You will still need to abide by Glipo's Content Policy, though.</p>
                                </div>
                            </card>
                        </div>
                    </div>
                
                <div class="pageNonExistent middle">
                    <div class="pageMessage">
                        <h1>This non-existent group has no rules</h1>
                        <p>That's somewhat unsurprising, though. You may have mistyped the URL there.</p>
                        <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^g\/[^\/]+\/modtools$" style="display: none;"> <!-- Group moderator tools page -->
                <div class="signedIn" style="display: block;">
                    <div class="isModerator" style="display: none;">
                        <h1 class="mobile">
                            <a href="https://glipo.net/settings#" class="groupName groupLink noColour"></a>
                            <a href="javascript:modVisitSettings();"><icon aria-label="Settings">settings</icon></a>
                        </h1>
                        <div class="tabs">
                            <div class="tabstrip">
                                <button class="selected" data-tab="modqueue">Modqueue</button>
                                <button data-tab="reports">Reports</button>
                                <button data-tab="modmail">Modmail</button>
                                <button data-tab="members">Members</button>
                            </div>
                            <div class="tabcontents giveMarginTop">
                                <div data-tab="modqueue" id="modModqueue">
                                    <div class="loadingSpinner"></div>
                                    <div class="modqueueItems"></div>
                                </div>
                                <div data-tab="reports" id="modReports">
                                    <div class="loadingSpinner"></div>
                                    <div class="modReportItems"></div>
                                </div>
                                <div data-tab="modmail" id="modmail">
                                    <div class="loadingSpinner"></div>
                                    <div class="modModmailList"></div>
                                </div>
                                <div data-tab="members" id="modMembers">
                                    <div class="loadingSpinner"></div>
                                    <div class="modMemberList"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="isNotModerator" style="display: block;">
                        <div class="pageMessage middle">
                            <h1 class="groupNameModRequirement">You must be a moderator to access moderator tools for this group</h1>
                            <p>This page is restricted to moderators only.</p>
                            <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                        </div>
                    </div>
                    <div class="isGroupBanned">
                        <div class="pageMessage middle">
                            <h1>You are currently banned from this group</h1>
                            <p>A moderator banned you from this group, preventing you from being able to access this group's moderator tools.</p>
                            <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                        </div>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to access moderator tools</h1>
                        <p>You must be a moderator of this group to access moderator tools.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
                <div class="loadingUser" style="display: none;">
                    <div class="loadingSpinner"></div>
                </div>
            </section>
            <section class="posts" data-location="^g\/[^\/]+\/settings$" style="display: none;"> <!-- Group settings page -->
                <div class="signedIn" style="display: block;">
                    <div class="isModerator" style="display: none;">
                        <div class="isOwner">
                            <span class="mobile">
                                <card class="transparent noPadding">
                                    <button onclick="visitModeratorTools();" class="transparent">
                                        <icon aria-hidden="true" class="flippable">arrow_back</icon>
                                        <span>Back</span>
                                    </button>
                                </card>
                            </span>
                            <h1 class="modSettingsHeading">Group settings</h1>
                            <div class="settingsSheet">
                                <label>
                                    <span>Group name</span>
                                    <input id="modSettingsGroupName">
                                </label>
                                <p class="itemDescription">The group name cannot be changed, but the casing of the letters in it can be changed.</p>
                                <label>
                                    <span>Description</span>
                                    <textarea placeholder="Tell us about what your group does..." maxlength="200" id="modSettingsGroupDescription"></textarea>
                                </label>
                                <p class="errorMessage" id="modSettingsProfileError"></p>
                                <div class="buttonRow">
                                    <button onclick="saveGroupProfile();" class="blue" id="modSettingsProfileButton">Save</button>
                                </div>
                                <h2>Rules</h2>
                                <p>Define what your group's members can and can't do through rules. Members can then report posts that violate certain rules through Glipo's reporting system.</p>
                                <div class="hasRules">
                                    <div class="modSettingsRules"></div>
                                </div>
                                <div class="hasNoRules">
                                    <p class="info middle">There are no rules for this group</p>
                                </div>
                                <div class="buttonRow">
                                    <button onclick="showNewGroupRuleDialog();" class="blue">New rule</button>
                                </div>
                                <h2>Modmail</h2>
                                <label>
                                    <span>Welcome message</span>
                                    <div class="contentEditor" id="modSettingsModmailMessage"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                                </label>
                                <p class="itemDescription">This welcome message will appear on the page that users visit to contact your group's moderators.</p>
                                <p class="errorMessage" id="modSettingsModmailError"></p>
                                <div class="buttonRow">
                                    <button onclick="saveGroupModmailSettings();" class="blue" id="modSettingsModmailButton">Save</button>
                                </div>
                            </div>
                        </div>
                        <div class="isNotOwner">
                            <div class="pageMessage middle">
                                <h1 class="groupNameModRequirement">You must be an owner of this group to change group settings</h1>
                                <p>You must be a moderator with owner permissions in order to change this group's settings.</p>
                                <button onclick="visitModeratorTools();" class="blue">Back to moderator tools</button>
                            </div>
                        </div>
                    </div>
                    <div class="isNotModerator" style="display: block;">
                        <div class="pageMessage middle">
                            <h1 class="groupNameModRequirement">You must be a moderator to access moderator tools for this group</h1>
                            <p>This page is restricted to moderators only.</p>
                            <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                        </div>
                    </div>
                    <div class="isGroupBanned">
                        <div class="pageMessage middle">
                            <h1>You are currently banned from this group</h1>
                            <p>A moderator banned you from this group, preventing you from being able to access this group's moderator tools.</p>
                            <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                        </div>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to access moderator tools</h1>
                        <p>You must be a moderator of this group to access moderator tools.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
                <div class="loadingUser" style="display: none;">
                    <div class="loadingSpinner"></div>
                </div>
            </section>
            <section class="posts" data-location="^g\/[^\/]+\/modmail$" style="display: none;"> <!-- Modmail sender page -->
                <div class="signedIn" style="display: block;">
                    <h1 class="modmailHeading">Message the moderators</h1>
                    <p><strong>Enter the message that you would like to send to the moderators of this group. A member of this group should reply shortly.</strong></p>
                    <div class="modmailMessage"></div>
                    <div class="contentEditor" id="modmailSendContent"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                    <div class="errorMessage" id="modmailSendError"></div>
                    <div class="buttonRow">
                        <button onclick="sendModmail();" class="blue modmailSendButton">Send</button>
                        <button onclick="window.history.back();">Cancel</button>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to send messages to moderators</h1>
                        <p>To send a message to the moderators of this group, please sign in.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^submit$" style="display: none;"> <!-- Post submitting page -->
                <div class="signedIn" style="display: block;">
                    <h1>Submit your post</h1>
                    <input placeholder="Enter a group to post to" class="grow" id="submitGroup">
                    <div class="tabs">
                        <div class="tabstrip">
                            <button class="selected" data-tab="writeup" id="submitWriteupTab">Writeup</button>
                            <button data-tab="media" id="submitMediaTab">Media</button>
                            <button data-tab="link" id="submitLinkTab">Link</button>
                        </div>
                        <div class="tabcontents" id="submitType">
                            <div data-tab="writeup">
                                <input placeholder="Post title" class="big" id="submitWriteupTitle">
                                <div class="contentEditor" id="submitWriteupContent"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                            </div>
                            <div data-tab="media">
                                <input placeholder="Post title" class="big" id="submitMediaTitle">
                                <div class="upload" id="submitMediaUpload"><div class="none"><label><input type="file"><span>Drag and drop or choose a file</span><button class="blue">Choose file</button></label></div><div class="uploaded"><div class="info"><span></span><button>Cancel</button></div><img class="result"></div></div>
                            </div>
                            <div data-tab="link">
                                <input placeholder="Post title" class="big" id="submitLinkTitle">
                                <input placeholder="URL to content" class="big" id="submitLinkUrl">
                            </div>
                        </div>
                    </div>
                    <div class="buttonRow">
                        <button onclick="submitPost();" class="blue submitButton">Submit</button>
                        <button onclick="window.history.back();">Cancel</button>
                    </div>
                    <p class="errorMessage" id="submitError"></p>
                </div>
                <div class="signedOut middle" style="display: none;">
                    <div class="pageMessage">
                        <h1>Make your mark</h1>
                        <p>Sign in to submit your brand new post. If you don't have an account, sign up!</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts userProfile" data-location="^u\/.*$" style="display: none;"> <!-- User page -->
                <span class="mobile">
                    <span class="pageExistent">
                        <card data-location="^u\/.*$" style="display: none;">
                            <h2><strong class="userUsername"></strong></h2>
                            <p><strong class="userStaffTitle"></strong></p>
                            <p class="userBio"></p>
                            <p title="This message was added by a member of Glipo staff." class="errorMessage userStaffCommentary"></p>
                            <p class="userJoinDate">Joined ---</p>
                            <p>
                                <strong class="userPoints">--- points</strong>
                                <span>·</span>
                                <span class="userPostCount">--- posts</span>
                                <span>·</span>
                                <span class="userCommentCount">--- comments</span>
                            </p>
                            <div class="userIsNotMe">
                                <button onclick="visitUserMessages();" class="big blue">Send message</button>
                            </div>
                        </card>
                        <span class="donorInfo">
                            <card>
                                <p class="donorSince">Glipo donor</p>
                            </card>
                        </span>
                    </span>
                </span>
                <div class="loadingPosts">
                    <div class="loadingSpinner"></div>
                </div>
                <div class="loadedPosts">
                    <card class="sorts">
                        <button onclick="sortPostsBy(&#39;newest&#39;);" aria-label="Newest" class="sort sortNewest"><icon aria-hidden="true">new_releases</icon> <span>Newest</span></button>
                        <button onclick="sortPostsBy(&#39;best&#39;);" aria-label="Best" class="sort sortBest"><icon aria-hidden="true">bar_chart</icon> <span>Best</span></button>
                    </card>
                </div>
                <div class="noPosts pageMessage middle">
                    <div class="userIsMe">
                        <h1>Nothing to show off yet!</h1>
                        <p>The world's waiting to see what you can make! Write a post or comment in a group that you're part of and it'll show here too.</p>
                        <button onclick="visitSubmitPost();" class="blue">Write a post</button>
                    </div>
                    <div class="userIsNotMe">
                        <h1>What a mystery...</h1>
                        <p>This user hasn't posted or commented on anything yet! Come back later when they've made something to share.</p>
                        <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    </div>
                </div>
                <div class="pageNonExistent pageMessage middle">
                    <div class="signedIn" style="display: block;">
                        <h1>Who is this?!</h1>
                        <p>No-one exists with this username. If you're looking for someone in particular, make sure that you typed in the username correctly!</p>
                        <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                    </div>
                    <div class="signedOut" style="display: none;">
                        <h1>Who is this?!</h1>
                        <p>No-one exists with this username. If you like the username, feel free to create an account with it!</p>
                        <button onclick="showSignUpDialog();" class="blue">Sign up</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^notifications$" style="display: none;"> <!-- Notifications page -->
                <div class="signedIn" style="display: block;">
                    <div class="tabs">
                        <div class="tabstrip">
                            <button class="selected" data-tab="unread">Unread</button>
                            <button data-tab="archive">Archive</button>
                            <button data-tab="messages">Messages</button>
                        </div>
                        <div class="tabcontents giveMarginTop" id="submitType">
                            <div data-tab="unread" id="unreadNotificationsTab">
                                <div class="loadingSpinner"></div>
                                <div class="unreadNotifications"></div>
                                <div class="notificationsNotEnabled" style="display: block;">
                                    <card>
                                        <h2>Never miss a message</h2>
                                        <p>Enable push notifications to keep updated when you're not on the site</p>
                                        <div class="buttonRow">
                                            <button onclick="enablePushNotifications();" class="blue">Enable</button>
                                        </div>
                                    </card>
                                </div>
                            </div>
                            <div data-tab="archive" id="archivedNotificationsTab">
                                <div class="loadingSpinner"></div>
                                <div class="archivedNotifications"></div>
                            </div>
                            <div data-tab="messages" id="messagesTab">
                                <div class="loadingSpinner"></div>
                                <div class="messageDms"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="signedOut middle" style="display: none;">
                    <div class="pageMessage">
                        <h1>Sign in to see your notifications</h1>
                        <p>To catch up with all of your messages and replies, please sign in.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^dm$" style="display: none;"> <!-- DM page -->
                <div class="signedIn" style="display: block;">
                    <div class="loadingDm">
                        <div class="loadingSpinner"></div>
                    </div>
                    <div class="loadedDm">
                        <div class="pageExistent">
                            <h1 class="dmHeader"></h1>
                            <div class="dmMessages"></div>
                            <div class="dmReplyContainer">
                                <div class="contentEditor" id="dmMessageReply"><div class="toolbar editing"><button aria-label="Bold" title="Bold"><icon>format_bold</icon></button><button aria-label="Italic" title="Italic"><icon>format_italic</icon></button><button aria-label="Strikethrough" title="Strikethrough"><icon>format_strikethrough</icon></button><button aria-label="Link" title="Link"><icon>link</icon></button><button aria-label="Inline code" title="Inline code"><icon>code</icon></button><button aria-label="Superscript" title="Superscript"><icon>keyboard_arrow_up</icon></button><button aria-label="Spoiler" title="Spoiler"><icon>new_releases</icon></button><span class="split"></span><button aria-label="Heading" title="Heading"><icon>title</icon></button><button aria-label="Bullet-point list" title="Bullet-point list"><icon class="flippable">format_list_bulleted</icon></button><button aria-label="Numerical list" title="Numerical list"><icon>format_list_numbered</icon></button><button aria-label="Checkbox" title="Checkbox"><icon>check_box</icon></button><button aria-label="Blockquote" title="Blockquote"><icon>format_quote</icon></button><button aria-label="Code block" title="Code block"><icon>description</icon></button><button aria-label="Horizontal rule" title="Horizontal rule"><icon>remove</icon></button><span class="split"></span><button aria-label="Table" title="Table"><icon>table_chart</icon></button><button aria-label="Media" title="Media"><icon>perm_media</icon></button><button class="special floatEnd">Preview</button></div><div class="toolbar previewing"><button class="special floatEnd">Edit</button></div><textarea placeholder="Write your thoughts here..."></textarea><div class="preview postContent fullContent"></div></div>
                                <div class="buttonRow">
                                    <button onclick="sendDmMessage();" class="blue">Send</button>
                                    <button onclick="window.history.back();">Cancel</button>
                                </div>
                                <p class="errorMessage" id="sendDmMessageError"></p>
                            </div>
                        </div>
                    </div>
                    <div class="pageNonExistent">
                        <div class="pageMessage middle">
                            <h1>This user does not exist...</h1>
                            <p>Check to see if you entered the right username in the URL.</p>
                            <button onclick="window.location.href = &#39;/notifications&#39;;" class="blue">View notifications</button>
                        </div>
                    </div>
                    <div class="selfMessaging">
                        <div class="pageMessage middle">
                            <h1>Talking to yourself?!</h1>
                            <p>You can't send messages to yourself ─ only to other people.</p>
                            <button onclick="window.location.href = &#39;/notifications&#39;;" class="blue">View notifications</button>
                        </div>
                    </div>
                </div>
                <div class="signedOut middle" style="display: none;">
                    <div class="pageMessage">
                        <h1>Sign in to send and receive messages</h1>
                        <p>You need a Glipo account in order to privately message users.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^settings$"> <!-- Settings page -->
                <div class="signedIn" style="display: block;">
                    <div class="loadedUser" style="display: block;">
                        <div class="tabs">
                            <div class="tabstrip">
                                <button class="selected" data-tab="general">General</button>
                                <button data-tab="safety">Safety</button>
                                <button data-tab="about">About</button>
                            </div>
                            <div class="tabcontents giveMarginTop">
                                <div data-tab="general" class="settingsSheet">
                                    <h2>Your profile</h2>
                                    <label>
                                        <span>Username</span>
                                        <input data-property="username" class="settingsPersonalProperty">
                                    </label>
                                    <p class="itemDescription">Your username cannot be changed, but the casing of the letters in it can be changed.</p>
                                    <label style="outline: none;">
                                        <span>Bio</span>
                                        <textarea placeholder="Write a brief description about yourself to show on your profile..." maxlength="200" data-property="bio" class="settingsPersonalProperty"></textarea>
                                    </label>
                                    <p class="errorMessage" id="settingsProfileError"></p>
                                    <div class="buttonRow">
                                        <button onclick="savePropertyType(&#39;settingsPersonalProperty&#39;, _(&#39;Saving...&#39;));" class="blue">Save</button>
                                    </div>
                                    <h2>Account security</h2>
                                    <label>
                                        <span>Current password</span>
                                        <input type="password" placeholder="(Unchanged)" id="settingsCurrentPassword">
                                    </label>
                                    <label>
                                        <span>New password</span>
                                        <input type="password" id="settingsNewPassword">
                                    </label>
                                    <p class="errorMessage" id="changePasswordError"></p>
                                    <div class="buttonRow">
                                        <button onclick="changePassword();" class="blue" id="changePasswordButton">Change password</button>
                                    </div>
                                    <h2>Delete your account</h2>
                                    <p>When you delete your account, your profile will be removed. Your posts and comments will still be visible to others, but your username will not be shown.</p>
                                    <p>You may want to delete your posts and comments first before deleting your account.</p>
                                    <button onclick="showDeleteAccountDialog();">Delete account</button>
                                </div>
                                <div data-tab="safety" class="settingsSheet">
                                    <h2>Blocked users</h2>
                                    <p>Messages and replies sent by the users listed below will not be shown in your notifications.</p>
                                    <div class="blockedUsers"><p class="info middle">You haven't blocked any users yet</p></div>
                                    <div class="loadingBanStatus" style="display: none;">
                                        <div class="loadingSpinner"></div>
                                    </div>
                                    <div class="hasBan" style="display: none;">
                                        <h2>Account status</h2>
                                        <p class="banStatus">You are currently banned from using Glipo.</p>
                                        <p>For more information about your ban, <a href="https://glipo.net/dm?user=modbot" target="_blank">check the messages that were sent to you from u/modbot</a>.</p>
                                        <button onclick="window.location.href = &#39;/appeal&#39;;" class="blue">Appeal ban</button>
                                    </div>
                                    <div class="hasNoBan" style="display: block;">
                                        <h2>Account status</h2>
                                        <p>There are currently no active bans on your Glipo account.</p>
                                    </div>
                                </div>
                                <div data-tab="about">
                                    <div class="middle">
                                        <img src="./Settings - Glipo_files/largeWhite.png" alt="" class="aboutLogo">
                                        <h2>Glipo Web Frontend</h2>
                                        <p>Connecting communities through the internet</p>
                                        <p>Made with ❤️ in Norwich, England</p>
                                        <button onclick="window.location.href = &#39;/about&#39;;">About us</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="loadingUser" style="display: none;">
                        <div class="loadingSpinner"></div>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to manage your Glipo account's settings</h1>
                        <p>You'll need to sign in with a Glipo account to modify its settings.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^staff$" style="display: none;"> <!-- Staff page -->
                <div class="signedIn" style="display: block;">
                    <div class="isStaff" style="display: none;">
                        <div class="tabs">
                            <div class="tabstrip">
                                <button class="selected" data-tab="modqueue">Modqueue</button>
                                <button data-tab="reports">Reports</button>
                                <button data-tab="staff">Staff members</button>
                            </div>
                            <div class="tabcontents giveMarginTop">
                                <div data-tab="modqueue" id="staffModqueue">
                                    <div class="loadingSpinner"></div>
                                    <div class="modqueueItems"></div>
                                </div>
                                <div data-tab="reports" id="staffReports">
                                    <div class="loadingSpinner"></div>
                                    <div class="staffReportItems"></div>
                                </div>
                                <div data-tab="staff" id="staffMembers">
                                    <div class="loadingSpinner"></div>
                                    <div class="staffMemberList"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="isNotStaff" style="display: block;">
                        <div class="pageMessage middle">
                            <h1>You must be a member of staff at Glipo to access the staff area</h1>
                            <p>Only staff members can access the staff area.</p>
                            <button onclick="window.location.href = &#39;/&#39;;" class="blue">Go home</button>
                        </div>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to access the staff area</h1>
                        <p>If you are a member of staff, please sign in with your staff account.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^creategroup$" style="display: none;"> <!-- Create a group page -->
                <div class="signedIn" style="display: block;">
                    <div class="loadingUserDetails" style="display: none;">
                        <div class="loadingSpinner"></div>
                    </div>
                    <div class="canCreateGroups" style="display: none;">
                        <h1>Create a group</h1>
                        <h2 class="step">1. Choose a group name</h2>
                        <card dir="ltr" class="createGroupName">
                            <span>g/</span>
                            <input placeholder="groupname" id="createGroupNameInput">
                        </card>
                        <p class="createGroupNamePrompt">The group name must be between 3-20 characters long, and must only contain lowercase and uppercase letters as well as numbers.</p>
                        <h2 class="step">2. Write a brief description of your group</h2>
                        <textarea id="createGroupDescriptionInput" placeholder="Write something here that will entice people to your group..." maxlength="200"></textarea>
                        <p>The group description will appear just below the group name and can only be a maximum of 200 characters long.</p>
                        <h3 class="step">3. Do the honours</h3>
                        <p>It's time for you to press the magic button! Check that everything above is correct, then press the button below to create your group.</p>
                        <button onclick="createGroup();" class="blue" id="createGroupButton">Create group</button>
                        <p class="errorMessage createGroupError"></p>
                    </div>
                    <div class="cannotCreateGroups" style="display: block;">
                        <div class="pageMessage middle">
                            <h1>You'll need at least 100 points to create a group</h1>
                            <p>We require our users to have a sufficient amount of points in order to create a group. This is to prevent spam and to ensure that users are fit to moderate their own groups.</p>
                            <p>Want to get more points? Try writing a post!</p>
                            <button onclick="visitSubmitPost();" class="blue">Write a post</button>
                        </div>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to create your own group</h1>
                        <p>You need a Glipo account with at least 100 points in order to create a group.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <section class="posts" data-location="^banned$" style="display: none;"> <!-- Ban page -->
                <div class="pageMessage middle">
                    <h1>Sorry, you cannot do that</h1>
                    <p class="banMessage">We don't know why you're here! Please try visiting Glipo again later.</p>
                    <button onclick="window.location.href = &#39;/appeal&#39;;" class="blue">Appeal ban</button>
                </div>
            </section>
            <section class="posts" data-location="^appeal$" style="display: none;"> <!-- Ban page -->
                <div class="signedIn" style="display: block;">
                    <h1>Appeal a ban</h1>
                    <p>If you've recently been banned from participating on Glipo and you feel that the ban was made in error, fill in this form to submit a ban appeal. A member of Glipo's staff will then assess your ban appeal request and may lift the ban that was put in place.</p>
                    <p>If you were banned from participating in a particular group, please instead message the relevant group moderators as this ban appeal form is only used for appealing site-wide bans.</p>
                    <p>In some cases, Glipo's staff may find that their decision to ban you was final. Submitting this ban appeal form does not guarantee that your ban will be lifted.</p>
                    <div class="loadingBanStatus" style="display: none;">
                        <div class="loadingSpinner"></div>
                    </div>
                    <div class="hasBan" style="display: none;">
                        <h2>Account status</h2>
                        <p class="banStatus">You are currently banned from using Glipo.</p>
                        <p>For more information about your ban, <a href="https://glipo.net/dm?user=modbot" target="_blank">check the messages that were sent to you from u/modbot</a>.</p>
                        <div class="canSubmitBanAppeal">
                            <h2>Appeal details</h2>
                            <p>Tell us why you think we should lift your ban below.</p>
                            <textarea placeholder="Explain why you think we banned you in error here..." id="appealSubmitReason"></textarea>
                            <label><input type="checkbox" id="appealAccept"><span>I promise not to violate the rules of Glipo's Content Policy again and I am sorry for any inconvenience that I have caused towards Glipo's staff</span></label>
                            <div class="end buttonRow">
                                <button onclick="submitAppeal();" class="blue appealSubmitButton">Submit</button>
                                <button onclick="window.history.back();">Cancel</button>
                            </div>
                            <p class="errorMessage" id="appealSubmitError"></p>
                        </div>
                        <div class="cannotSubmitBanAppeal">
                            <p class="errorMessage">Sorry, you cannot submit a ban appeal because the decision to ban you was determined by Glipo's staff to be final.</p>
                        </div>
                    </div>
                    <div class="hasNoBan" style="display: block;">
                        <h2>Account status</h2>
                        <p>There are currently no active bans on your Glipo account, and so you do not need to submit an appeal at this time.</p>
                    </div>
                </div>
                <div class="signedOut" style="display: none;">
                    <div class="pageMessage middle">
                        <h1>Sign in to appeal a ban</h1>
                        <p>We'll need you to sign in with the account that you received the ban from so that you can appeal it.</p>
                        <button onclick="showSignInDialog();" class="blue">Sign in</button>
                    </div>
                </div>
            </section>
            <aside id="sidebar">
                <span class="signedOut" style="display: none;">
                    <card data-location="^g\/[^\/]+$|^\/$" style="display: none;">
                        <h1>Welcome to Glipo</h1>
                        <p>Glipo is a social network where you can discover your community through our groups.</p>
                        <button onclick="showSignUpDialog();" class="big blue">Sign up</button>
                    </card>
                </span>
                <span class="loadedTrendingGroups">
                    <card data-location="^\/$" style="display: none;">
                        <h2>Trending groups</h2>
                        <div class="trendingGroups"></div>
                    </card>
                </span>
                <span class="canCreateGroups" style="display: none;">
                    <card data-location="^\/$" style="display: none;">
                        <h1>Want a group of your own?</h1>
                        <p>You're now eligible to start your own groups! Let people discover your very own community.</p>
                        <button onclick="window.location.href = &#39;/creategroup&#39;;" class="big blue">Create a group</button>
                    </card>
                </span>
                <span class="pageExistent">
                    <card data-location="^g\/[^\/]+$" style="display: none;">
                        <h2>About this group</h2>
                        <p><strong class="groupMemberCount">--- members</strong></p>
                        <p class="groupPostCount">--- posts</p>
                        <p class="groupCommentCount">--- comments</p>
                        <button onclick="toggleGroupMembership();" class="big blue groupJoinButton">Join</button>
                        <span class="signedIn" style="display: inline;">
                            <span class="isModerator" style="display: none;">
                                <button onclick="visitModeratorTools();" class="big">Moderator tools</button>
                            </span>
                            <span class="isNotModerator" style="display: inline;">
                                <button onclick="visitModmailSender();" class="big">Message moderators</button>
                            </span>
                        </span>
                    </card>
                    <card data-location="^g\/[^\/]+\/posts\/[^\/]+$" style="display: none;">
                        <h2 class="postGroupHeader"></h2>
                        <p class="postGroupDescription"></p>
                        <button onclick="toggleGroupMembership();" class="big blue groupJoinButton">Join</button>
                        <button onclick="visitGroup();" class="big">Visit group</button>
                    </card>
                    <card data-location="^g\/[^\/]+\/modtools$" style="display: none;">
                        <h2 class="groupName"></h2>
                        <p class="groupDescription"></p>
                        <button onclick="modVisitGroup();" class="big">Visit group</button>
                        <button onclick="modVisitSettings();" class="big">Settings</button>
                    </card>
                    <card data-location="^g\/[^\/]+\/settings$" style="display: none;">
                        <h2 class="groupName"></h2>
                        <button onclick="modVisitGroup();" class="big">Visit group</button>
                        <button onclick="visitModeratorTools();" class="big">Moderator tools</button>
                    </card>
                    <card data-location="^g\/[^\/]+\/modmail$" style="display: none;">
                        <h2 class="groupName"></h2>
                        <p class="groupDescription"></p>
                        <button onclick="toggleGroupMembership();" class="big blue groupJoinButton">Join</button>
                        <button onclick="modVisitGroup();" class="big">Visit group</button>
                    </card>
                    <span class="hasRules">
                        <card data-location="^g\/[^\/]+$|^g\/[^\/]+\/posts\/[^\/]+$" style="display: none;">
                            <h2>Group rules</h2>
                            <div class="groupRules"></div>
                        </card>
                    </span>
                    <card data-location="^u\/.*$" style="display: none;">
                        <h2><strong class="userUsername"></strong></h2>
                        <p><strong class="userStaffTitle"></strong></p>
                        <p>
                            <span class="userBio"></span>
                            <span class="userIsMe">
                                <a href="https://glipo.net/settings" class="userBioEditLink">Edit</a>
                            </span>
                            </p><p title="This message was added by a member of Glipo staff." class="errorMessage userStaffCommentary"></p>
                        <p></p>
                        <p class="userJoinDate">Joined ---</p>
                        <p>
                            <strong class="userPoints">--- points</strong>
                            <span>·</span>
                            <span class="userPostCount">--- posts</span>
                            <span>·</span>
                            <span class="userCommentCount">--- comments</span>
                        </p>
                        <div class="userIsNotMe">
                            <button onclick="visitUserMessages();" class="big blue">Send message</button>
                        </div>
                    </card>
                    <span class="donorInfo">
                        <card>
                            <p class="donorSince">Glipo donor</p>
                        </card>
                    </span>
                </span>
                <card data-location="^submit$" style="display: none;">
                    <h2>Community guidelines</h2>
                    <details>
                        <summary>1. Think before you post</summary>
                        <p>Before pressing the submit button, give yourself a
                            few seconds to think whether the actions you're
                            taking will be beneficial and useful to others on
                            Glipo.</p>
                    </details>
                    <details>
                        <summary>2. There's a human at the other end</summary>
                        <p>Remember that real, living people are going to read
                            your posts and comments. Be polite and don't offend
                            anyone ─ words can hurt. If you're criticising
                            someone's opinion, do so politely and
                            constructively.</p>
                    </details>
                    <details>
                        <summary>3. Do as you would in real life</summary>
                        <p>Behave as you would do when you're offline. Pretend
                            that a member of your family is reading your posts ─
                            it's a good check to see if the content that you're
                            posting is fit for discussion!</p>
                    </details>
                    <details>
                        <summary>4. Help keep groups neat and tidy</summary>
                        <p>Don't repost something that's already posted on the
                            group (unless it's <em>really</em> old) ─ people
                            don't want to see the same post again once or twice!
                            In addition to this, make sure that you properly
                            attribute others (this can be done by crossposting
                            if you're re-sharing a Glipo post on a different
                            group) and that you also format your posts correctly
                            (use the preview option to check your post's
                            formatting before submitting it)!</p>
                    </details>
                    <details>
                        <summary>5. Abide by the rules</summary>
                        <p>Make sure that your post complies with the rules of
                            the group that you're posting to. As well as this,
                            ensure that your post won't violate our
                            <a href="https://glipo.net/about/help.html?article=termsofservice.md">Terms of Service</a>
                            and
                            <a href="https://glipo.net/about/help.html?article=contentpolicy.md">Content Policy</a>.
                            Failure to do so could result in a group-wide ban,
                            or even a site-wide ban.</p>
                    </details>
                </card>
                <span class="hasSubmitGroupRules">
                    <card>
                        <h2 class="submitGroupRulesHeader">Group rules</h2>
                        <div class="submitGroupRules"></div>
                    </card>
                </span>
                <card>
                    <div class="footerSide">
                        <a href="https://glipo.net/">Feed</a>
                        <a href="https://glipo.net/settings">Settings</a>
                        <a href="https://glipo.net/staff">Staff area</a>
                        <a href="https://glipo.net/appeal">Appeal a ban</a>
                        <a href="https://glipo.net/creategroup">Create a group</a>
                        <a href="https://glipo.net/g/Glipo">g/Glipo</a>
                        <a href="https://glipo.net/g/Glipo/modmail">Message us</a>
                    </div>
                    <div class="footerSide">
                        <a href="https://glipo.net/about">About Glipo</a>
                        <a href="https://glipo.net/about/help.html">Help centre</a>
                        <a href="https://glipo.net/about/donate.html">Donate to us</a>
                        <a href="https://glipo.net/about/help.html?article=termsofservice.md">Terms of Service</a>
                        <a href="https://glipo.net/about/help.html?article=contentpolicy.md">Content Policy</a>
                        <a href="https://glipo.net/about/help.html?article=privacypolicy.md">Privacy Policy</a>
                        <a href="https://glipo.net/about/help.html?article=accessibility.md">Accessibility</a>
                    </div>
                    <p>Copyright © Glipo Technologies. All Rights Reserved.</p>
                </card>
            </aside>
        </main>
        <dialog class="alertDialog">
            <div class="title">
                <span class="alertTitle"></span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="alertContent"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="closeDialogs();" class="blue">OK</button>
                </div>
            </div>
        </dialog>
        <dialog class="signInDialog hasInputs">
            <div class="title">
                <span>Sign in</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <h2>Welcome back</h2>
                <p class="labelDescription">Enter your email address and password to sign into your Glipo account.</p>
                <p><span>Don't have an account yet?</span> <a href="javascript:switchToSignUpDialog();">Sign up instead</a></p>
                <label>
                    <span>Email address</span>
                    <input type="email" id="signInEmail">
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" id="signInPassword">
                </label>
                <p class="errorMessage labelDescription" id="signInError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="signIn();" class="blue" id="signInButton">Sign in</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="signUpDialog hasInputs">
            <div class="title">
                <span>Sign up</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <h2>Join the conversation</h2>
                <p class="labelDescription"><span>Enter your email address and password below to sign up to Glipo and discover your community.</span> <a href="javascript:switchToSignInDialog();">Sign in instead</a></p>
                <label>
                    <span>Email address</span>
                    <input type="email" id="signUpEmail">
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" id="signUpPassword">
                </label>
                <p class="errorMessage labelDescription" id="signUpError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="switchToSignUpUsernameDialog();" class="blue">Next</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="signUpUsernameDialog hasInputs">
            <div class="title">
                <span>Sign up</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <h2>Nearly there</h2>
                <p class="labelDescription"><span>Choose a username for your account. Your username will be visible to everyone when you post or comment on Glipo.</span></p>
                <label>
                    <span>Username</span>
                    <input id="signUpUsername">
                </label>
                <p class="errorMessage labelDescription" id="signUpUsernameError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="signUp();" class="blue" id="signUpUsernameButton">Sign up</button>
                    <button onclick="switchToSignUpDialog();">Back</button>
                </div>
            </div>
        </dialog>
        <dialog class="ceInsertLinkDialog hasInputs">
            <div class="title">
                <span>Insert link</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <label>
                    <span>Link text</span>
                    <input id="ceInsertLinkText">
                </label>
                <label>
                    <span>URL to content</span>
                    <input id="ceInsertLinkUrl">
                </label>
                <p class="errorMessage labelDescription" id="ceInsertLinkError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="ceInsertLink();" class="blue">Insert</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="ceInsertCheckboxDialog hasInputs">
            <div class="title">
                <span>Insert checkbox</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <label>
                    <span>Checkbox state</span>
                    <input type="checkbox" id="ceInsertCheckboxState">
                </label>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="ceInsertCheckbox();" class="blue">Insert</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="ceInsertTableDialog hasInputs">
            <div class="title">
                <span>Insert table</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <label>
                    <span>Columns</span>
                    <input type="number" min="1" max="20" step="1" value="3" id="ceInsertTableColumns">
                </label>
                <label>
                    <span>Rows</span>
                    <input type="number" min="1" max="100" step="1" value="3" id="ceInsertTableRows">
                </label>
                <p class="errorMessage labelDescription" id="ceInsertTableError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="ceInsertTable();" class="blue">Insert</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="ceInsertMediaDialog hasInputs">
            <div class="title">
                <span>Insert media</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="labelDescription">PNG, JPEG and GIF photos are supported.</p>
                <label>
                    <span>URL to media</span>
                    <input id="ceInsertMediaUrl">
                </label>
                <label>
                    <span>Brief description</span>
                    <input placeholder="eg. Photo of dancing lizard" id="ceInsertMediaDescription">
                </label>
                <p class="errorMessage labelDescription" id="ceInsertMediaError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="ceInsertMedia();" class="blue">Insert</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="leaveGroupDialog">
            <div class="title">
                <span>Leave group?</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>Do you really want to leave this group? You can join again later if you change your mind.</p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="leaveGroup();" class="blue">Yes</button>
                    <button onclick="closeDialogs();">No</button>
                </div>
            </div>
        </dialog>
        <dialog class="staffRemovePostModDialog hasInputs">
            <div class="title">
                <span>Remove a post</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="labelDescription">Enter the reason as to why this post was removed. The post author will see this reason.</p>
                <label>
                    <span>Reason</span>
                    <input id="staffRemovePostModReason">
                </label>
                <p class="errorMessage labelDescription" id="staffRemovePostModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="staffRemovePost();" class="blue">Remove</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="modRemovePostModDialog hasInputs">
            <div class="title">
                <span>Remove a post</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="labelDescription">Enter the reason as to why this post was removed. The post author will see this reason.</p>
                <label>
                    <span>Reason</span>
                    <input id="modRemovePostModReason">
                </label>
                <p class="errorMessage labelDescription" id="modRemovePostModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="modRemovePost();" class="blue">Remove</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="actOnReportModDialog hasTextarea hasMixedInput">
            <div class="title">
                <span>Act upon a report</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="labelDescription">Please enter the details of the action that you wish to take.</p>
                <p>Reason for action:</p>
                <textarea placeholder="(Optional)" class="noResize" id="actOnReportModReason"></textarea>
                <div class="spacer"></div>
                <label><input type="checkbox" checked="" id="actOnReportModNoMessage"><span>Send message to offender via u/modbot as to why this content was removed</span></label>
                <span class="isStaff" style="display: none;">
                    <label><input type="checkbox" id="actOnReportModDeleteContent"><span>Delete the content from Glipo's servers</span></label>
                    <label><input type="checkbox" id="actOnReportModBanOffender"><span>Ban the offender from Glipo</span></label>
                </span>
                <p class="errorMessage labelDescription" id="actOnReportModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="actOnReport();" class="blue actOnReportModButton">Act</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="changePermsModDialog hasMultilineRadios">
            <div class="title">
                <span>Change a member's permissions</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="labelDescription" id="changePermsModDescription">What permissions do you wish to grant to this user?</p>
                <label>
                    <input type="radio" name="changePermsModPermissions" value="owner">
                    <span>
                        <strong>Owner</strong><br>
                        <span>Grant this user all moderator permissions, with the additional ability to change potentially dangerous settings, such as adding and removing other moderators and changing the group description and rules.</span>
                    </span>
                </label>
                <label>
                    <input type="radio" name="changePermsModPermissions" value="moderator">
                    <span>
                        <strong>Standard moderator</strong><br>
                        <span>Grant this user basic moderator permissions, allowing them to act upon reports and remove posts that violate the rules.</span>    
                    </span>
                </label>
                <label>
                    <input type="radio" name="changePermsModPermissions" value="member">
                    <span>
                        <strong>Member</strong><br>
                        <span>Don't grant this user any moderator permissions. This user will only be able to write, edit and delete their own posts and comments when in this group.</span>    
                    </span>
                </label>
                <label>
                    <input type="radio" name="changePermsModPermissions" value="banned">
                    <span>
                        <strong>Banned user</strong><br>
                        <span>Ban this user from this group, preventing them from being able to write their own posts and comments. They can still view and vote on posts.</span>    
                    </span>
                </label>
                <p class="errorMessage" id="changePermsModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="changeMemberPerms();" class="blue changePermsModButton">Grant</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="deletePostDialog">
            <div class="title">
                <span>Delete post</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>Do you really want to delete this post? This action cannot be undone.</p>
                <p class="errorMessage" id="deletePostError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button class="blue deletePostButton">Delete</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="deleteCommentDialog">
            <div class="title">
                <span>Delete comment</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>Do you really want to delete this comment? This action cannot be undone.</p>
                <p class="errorMessage" id="deleteCommentError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button class="blue deleteCommentButton">Delete</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="reportBlockedDialog">
            <div class="title">
                <span>Reporting is blocked</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>You cannot send reports because you are currently banned from using Glipo for offences related to reports abuse.</p>
                <p><span>Need to urgently contact us? Email us:</span> <a href="mailto:abuse@glipo.net">abuse@glipo.net</a></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="closeDialogs();" class="blue">OK</button>
                    <button onclick="window.location.href = &#39;/appeal&#39;;">Appeal ban</button>
                </div>
            </div>
        </dialog>
        <dialog class="reportLoaderDialog loader">
            <div class="title">
                <span class="reportTitle">Report content</span>
            </div>
            <div class="content">
                <div class="loadingSpinner"></div>
            </div>
        </dialog>
        <dialog class="reportDialog">
            <div class="title">
                <span class="reportTitle">Report content</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="reportDescription">Tell us why you're reporting this post so that we can further investigate the issue.</p>
                <label class="reportRuleViolationOption"><input type="radio" name="reportType" value="rules"><span class="reportGroupRule">It violates the rules of this group</span></label>
                <label><input type="radio" name="reportType" value="spam"><span>It is spam or unsolicited advertising</span></label>
                <label><input type="radio" name="reportType" value="misinformation"><span>It is deceptive or misleading, or is otherwise misinformative</span></label>
                <label><input type="radio" name="reportType" value="abuse"><span>It is abusive, harassing or offensive</span></label>
                <label><input type="radio" name="reportType" value="other"><span>It is something else</span></label>
                <p><a href="https://glipo.net/about/help.html?article=whoreceivesreports.md" target="_blank">Learn more about who receives reports</a></p>
                <p class="reportError errorMessage"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="reportNext();" class="blue">Next</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="reportNextDialog hasTextarea">
            <div class="title">
                <span class="reportTitle">Report content</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p><strong class="reportSelectedType"></strong></p>
                <div class="reportSelectedTypeForm"></div>
                <p>Is there anything else that you would like to tell us?</p>
                <textarea placeholder="(Optional)" class="reportExtra noResize"></textarea>
                <p class="reportError errorMessage"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="reportSend();" class="blue reportSendButton">Send</button>
                    <button onclick="reportBack();">Back</button>
                </div>
            </div>
        </dialog>
        <dialog class="reportThanksDialog hasParagraph">
            <div class="title">
                <span class="reportTitle">Report content</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <h2>Your report has been sent</h2>
                <p>Thanks for making the Glipo community safe! Your report will be seen shortly.</p>
                <p>Please note that not all reports are responded to straight away due to other reports taking priority, and that some reports that we investigate may not result in an outcome.</p>
                <p><span>Depending on the details of your report, your report may either be read by staff or group moderators.</span> <a href="https://glipo.net/about/help.html?article=whoreceivesreports.md" target="_blank">Learn more about who will receive your report</a></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="closeDialogs();" class="blue">Done</button>
                </div>
            </div>
        </dialog>
        <dialog class="newRuleModDialog hasTextarea hasMixedInput">
            <div class="title">
                <span>New rule</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>Rule title:</p>
                <input placeholder="eg. Do not post dino pics" maxlength="100" class="big" id="newRuleModTitle">
                <p>Rule contents:</p>
                <textarea placeholder="Tell us more about the rule..." maxlength="500" class="noResize" id="newRuleModContent"></textarea>
                <p class="errorMessage labelDescription" id="newRuleModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="newGroupRule();" class="blue newRuleModButton">Save</button>
                    <button onclick="closeDialogs();">Cancel</button>
                </div>
            </div>
        </dialog>
        <dialog class="editRuleModDialog hasTextarea hasMixedInput">
            <div class="title">
                <span>Edit a rule</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p>Rule title:</p>
                <div class="ruleEditLine">
                    <select id="editRuleModPosition"></select>
                    <input placeholder="eg. Do not post dino pics" maxlength="100" id="editRuleModTitle">
                </div>
                <p>Rule contents:</p>
                <textarea placeholder="Tell us more about the rule..." maxlength="500" class="noResize" id="editRuleModContent"></textarea>
                <p class="errorMessage labelDescription" id="editRuleModError"></p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="saveGroupRule();" class="blue editRuleModButton">Save</button>
                    <button onclick="closeDialogs();">Cancel</button>
                    <button onclick="deleteGroupRule();" class="deleteRuleModButton">Delete rule</button>
                </div>
            </div>
        </dialog>
        <dialog class="blockUserDialog">
            <div class="title">
                <span>Block user?</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="blockUsername">Do you really want to block this user? You can unblock them later in Glipo's settings.</p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="blockSelectedUser();" class="blue">Yes</button>
                    <button onclick="closeDialogs();">No</button>
                </div>
            </div>
        </dialog>
        <dialog class="deleteAccountDialog hasParagraph">
            <div class="title">
                <span>Delete account?</span>
                <button onclick="closeDialogs();"><icon aria-label="Close dialog">close</icon></button>
            </div>
            <div class="content">
                <p class="blockUsername">Do you really want to delete your Glipo account? This cannot be undone! Your posts and comments will still be visible on Glipo, but your username will be removed from them. We'll miss you!</p>
                <div class="spacer"></div>
                <div class="end buttonRow">
                    <button onclick="deleteAccount();" class="blue deleteAccountButton">Yes</button>
                    <button onclick="deleteAccountActiveFromSettings = false; closeDialogs();">No</button>
                </div>
            </div>
        </dialog>
    
</body></html>