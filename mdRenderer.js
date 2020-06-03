/*
    Glipo

    Copyright (C) Glipo Technologies. All Rights Reserved.

    https://glipo.cf
*/

function renderMarkdown(markdown) {
    // HTML injection blocking ─ we use an invisible character which HTML won't parse
    markdown = markdown.replace(/</g, "<\u200C");

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
        openLinksInNewWindow: true,
        splitAdjacentBlockquotes: true
    });
    var html = showdownConverter.makeHtml(markdown);

    console.log(html);
    
    // JS injection blocking
    html = html.replace(/(?<!<code)javascript:(?!([\w\s])*<\/code>)/g, "javascript:return;");

    // Spoilers
    html = html.replace(/(?<!<code)&gt;!(((?!&gt;!).)*)!&lt;(?!([\w\s])*<\/code>)/g, "<span tabindex='0' class='spoiler'>$1</span>");

    // Superscripts
    html = html.replace(/(?<!<code)\^\(([^)]*)\)(?!([\w\s])*<\/code>)/g, "<sup>$1</sup>"); // Bracketed
    html = html.replace(/(?<!<code)\^([^\s]*)(?!([\w\s])*<\/code>)/g, "<sup>$1</sup>"); // Non-bracketed

    // Mentions
    html = html.replace(/(?<!<code)g\/(([a-zA-Z0-9])*)(?!([\w\s])*<\/code>)/g, "<a href='https://glipo.cf/g/$1'>g/$1</a>"); // Groups
    html = html.replace(/(?<!<code)u\/(([a-zA-Z0-9])*)(?!([\w\s])*<\/code>)/g, "<a href='https://glipo.cf/u/$1'>u/$1</a>"); // Groups

    return html;
}