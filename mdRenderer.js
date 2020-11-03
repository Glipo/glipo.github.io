/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.net
*/

function renderMarkdown(markdown, openLinksInNewTab = true) {
    // HTML injection blocking ─ we use an invisible character which HTML won't parse
    markdown = markdown.trim().replace(/</g, "<\u200C");

    // Ensuring that spoilers appear on single lines
    var markdownSplit = markdown.split("\n");
    var newMarkdown = [];

    for (var i = 0; i < markdownSplit.length; i++) {
        if (markdownSplit[i].startsWith(">!")) {
            newMarkdown.push("\u200C" + markdownSplit[i]);
        } else {
            newMarkdown.push(markdownSplit[i]);
        }
    }

    markdown = newMarkdown.join("\n");

    var showdownConverter = new showdown.Converter({
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        disableForced4SpacesIndentedSublists: true,
        simpleLineBreaks: true,
        requireSpaceBeforeHeadingText: true,
        openLinksInNewWindow: openLinksInNewTab,
        splitAdjacentBlockquotes: true
    });
    var html = showdownConverter.makeHtml(markdown);
    
    if (!(core.browserSupport.isWebkit && !core.browserSupport.isChromium)) {
        // JS injection blocking
        html = html.replace(new RegExp("(?<!<code)javascript:(?!([\\\w\\\s])*<\\\/code>)", "g"), "javascript:return;");

        // Spoilers
        html = html.replace(new RegExp("(?<!<code)&gt;!(((?!&gt;!).)*)!&lt;(?!([\\\w\\\s])*<\\\/code>)", "g"), "<span tabindex='0' class='spoiler'>$1</span>");

        // Superscripts
        html = html.replace(new RegExp("(?<!<code)\\\^\\\(([^)]*)\\\)(?!([\\\w\\\s])*<\\\/code>)", "g"), "<sup>$1</sup>"); // Bracketed
        html = html.replace(new RegExp("(?<!<code)\\\^([^\\\s]*)(?!([\\\w\\\s])*<\\\/code>)", "g"), "<sup>$1</sup>"); // Non-bracketed

        // Mentions
        html = html.replace(new RegExp("(?<!<code)(^|>|\\\s|\\\/)g\\\/(([a-zA-Z0-9])+)($|<|\\\s)(?!([\\\w\\\s])*<\\\/code>)", "g"), "$1<a href='https://glipo.net/g/$2'>g/$2</a>$4"); // Groups
        html = html.replace(new RegExp("(?<!<code)(^|>|\\\s|\\\/)u\\\/(([a-zA-Z0-9])+)($|<|\\\s)(?!([\\\w\\\s])*<\\\/code>)", "g"), "$1<a href='https://glipo.net/u/$2'>u/$2</a>$4"); // Users
    } else { // Support for WebKit - WebKit doesn't support negative lookbehinds yet
        // JS injection blocking
        html = html.replace(new RegExp("javascript:", "g"), "javascript:return;");

        // Spoilers
        html = html.replace(new RegExp("&gt;!(((?!&gt;!).)*)!&lt;", "g"), "<span tabindex='0' class='spoiler'>$1</span>");

        // Superscripts
        html = html.replace(new RegExp("\\\^\\\(([^)]*)\\\)", "g"), "<sup>$1</sup>"); // Bracketed
        html = html.replace(new RegExp("\\\^([^\\\s]*)", "g"), "<sup>$1</sup>"); // Non-bracketed

        // Mentions
        html = html.replace(new RegExp("(^|>|\\\s|\\\/)g\\\/(([a-zA-Z0-9])+)($|<|\\\s)", "g"), "$1<a href='https://glipo.net/g/$2'>g/$2</a>$4"); // Groups
        html = html.replace(new RegExp("(^|>|\\\s|\\\/)u\\\/(([a-zA-Z0-9])+)($|<|\\\s)", "g"), "$1<a href='https://glipo.net/u/$2'>u/$2</a>$4"); // Users
    }

    return html;
}