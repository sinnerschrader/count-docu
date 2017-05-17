var marked = require("marked");
var handlebars = require("handlebars");
var hljs = require("highlight.js");
var fs = require("fs");
var refToLinkConverter = require("./util").refToLinkConverter;


var init = function (options) {
    var imageTemplate = options.imageTemplate || __dirname + "/image.hbs";
    var imageTemplate = handlebars.compile(fs.readFileSync(imageTemplate, "UTF-8"));

    var markedRenderer = new marked.Renderer();

    markedRenderer.image = function (href, title, text) {
        return imageTemplate({href: href, title: title, text: text});
    };

    markedRenderer.heading = function (text, level) {
        return "<h" + (level + markedRenderer.baseLevel) + ">" + text + "</h" + (level + markedRenderer.baseLevel) + ">";
    }

    markedRenderer.blockquote = function (text) {
        var result = /.*(\[\[(warning|info|danger)\]\])/.exec(text)
        var level = "info";
        var type = "callout";
        if (result != null && result.length) {
            if (result.length >= 3 && typeof result[2] !== "undefined") {
                level = result[2];
            }
            text = text.substring(0, result[0].length - result[1].length) + text.substring(result[0].length);
        }
        //return level+"-"+type+"   "+text;
        return "<div class=\"bs-" + type + " bs-" + type + "-" + level + "\">" + text + "</div>";
    }

    originalCodeRenderer = markedRenderer.code.bind(markedRenderer);
    markedRenderer.code = function (code, lang, escaped) {
        var result = /(.*)\|(.*)/.exec(lang);
        var originalLang = lang;

        if (result !== null && result.length === 3 && result[2] === "noctc") {
            originalLang = result[1];
        }
        var renderedCode = originalCodeRenderer(code, originalLang, escaped);
        if (!(result !== null && result.length === 3 && result[2] === "noctc") && options.ctcOnCodeBlock) {
            var buttonString = "<button class='js-copyCodeToBtn code-button' data-code='" + code + "'>Copy code to clipboard</button>";
            return renderedCode.replace(/<\/code>(.*)<\/pre>/, "</code>" + buttonString + "</pre>").replace("<pre>", "<pre class='code-pre'>");
        }
        return renderedCode;
    };

    markedRenderer.table = function (header, body) {
        // TODO this is the bootstrap table
        return '<table class="table table-bordered table-striped">\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + '<tbody>\n'
            + body
            + '</tbody>\n'
            + '</table>\n';
    }

    originalLinkRenderer = markedRenderer.link.bind(markedRenderer);
    markedRenderer.link = function (href, title, text) {
        if (/^ref:/.test(href)) {
            var link = refToLinkConverter(href.substring('ref:'.length));
            href = '#' + link
            if (markedRenderer.links.indexOf(link) < 0) {
                throw new Error("cannot find link " + link)
            }
        }
        return originalLinkRenderer(href, title, text);
    }

    marked.setOptions({
        renderer: markedRenderer,
        gfm: true,
        tables: true,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });


    handlebars.registerHelper('plantuml', function (source, options) {
        if (!source || source === "") {
            return "";
        }
        return "<img src='" + source + "'></img>";
    });

    handlebars.registerHelper('plaintext', function (source, options) {
        if (!source || source === "") {
            return "";
        }
        var lines = source.split('\n');
        var keepEmptyLines = false
        lines = lines.filter(function (line) {
            if (!keepEmptyLines && line.trim().length == 0) {
                return false;
            }
            keepEmptyLines = true;
            return true;
        })
        return lines.join('<BR>');
    });

    handlebars.registerHelper('formatDate', function (date, options) {
        return date.getDate() + "." + (date.getMonth() + 1) + "." + (date.getYear() - 100);
    });


    handlebars.registerHelper('markdown', function (md, level, options) {
        if (md) {
            level = level || 1;
            markedRenderer.baseLevel = level;
            markedRenderer.links = options.data.root.links
            var html = marked(md);
            return html;
        } else {
            return "";
        }
    });

    handlebars.registerHelper("inc", function (lvalue, options) {
        return lvalue + 1;
    });

    handlebars.registerHelper("ref", function (lvalue, options) {
        var link = refToLinkConverter(lvalue);
        if (options.data.root.links.indexOf(link) < 0) {
            throw new Error("cannot find link to " + lvalue);
        }
        return link;
    });


}
var render = function (template, ctx, options) {
    init(options);
    var compiledTemplate = handlebars.compile(template);
    return compiledTemplate(ctx);
}

module.exports = render;
