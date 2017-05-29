var file = require("file");
var fs = require("fs");
var render = require("./render");
var pathTool = require('path')
var plantuml = require('./plantuml')
var refToLinkConverter = require("./util").refToLinkConverter;


var cloneArray = function (link) {
    return link.map(function (l) {
        return l
    });
}

var readChapter = function (dirName, level, options, link) {
    var dir = pathTool.parse(dirName);
    var title = require('./util').removePrefixAndSuffixFromName(dir.name);
    if (typeof link === 'undefined') {
        link = []
    } else {
        link.push(title);
    }
    var chapter = {title: title, link: '/' + link.join('/'), sections: [], chapters: []};
    var ls = fs.readdirSync(dirName);
    ls.forEach(function (fileName) {
        var path = dirName + "/" + fileName;
        if (fs.lstatSync(path).isFile()) {
            var ext = pathTool.extname(path).substring(1);
            if (ext == "md") {
                var content = fs.readFileSync(path, "UTF-8");
                var title = require('./util').removePrefixAndSuffixFromName(fileName);
                if (title === "") {
                    chapter.sections.push(content);
                } else {
                    link.push(title);
                    chapter.chapters.push({level: level, title: title, content: content, link: '/' + link.join('/')});
                    link.pop();
                }
            } else if ("puml" === ext) {
                var content = fs.readFileSync(path, "UTF-8");
                var vendor = __dirname + '/../vendor/plantuml.jar';
                plantuml.generate(path, {format: 'png'}, vendor, function (e, buffer) {
                    fs.writeFileSync(options.targetPath + "/" + fileName, buffer);
                })
            }
        } else {
            var newChapter = readChapter(path, level + 1, options, cloneArray(link))
            chapter.chapters.push(newChapter);
        }

    });
    return chapter;
};

var collectLinks = function (chapter) {
    var links = [];
    if (chapter.chapters) {
        chapter.chapters.forEach(function (c) {
            links.push(refToLinkConverter(c.link));
            links = links.concat(collectLinks(c));
        })
    }
    return links;
};

function generate(options) {


    var outputDir = "/dist";
    var workingDir = process.cwd();

    var targetPath = workingDir + outputDir;
    var template = __dirname + "/doc.hbs";

    options = options || {};


    var defaultOptions = {
        targetPath: targetPath,
        source: workingDir + "/src",
        template: template,
        targetHtml: workingDir + outputDir + (options.pdf?"/pdf.html":"/index.html"),
        title: "Documentation",
        description: "Nice project with a nice documentation",
        maxCommits: 10,
        headerColor: '#fff',
        headerBgColor: '#563d7c',
        headerDescriptionColor: '#cdbfe3',
        docGitPath: 'src'
    };

    if (options) {
        Object.keys(defaultOptions).forEach(function (key) {
            if (typeof options[key] === 'undefined') {
                options[key] = defaultOptions[key];
            }
        })
    } else {
        options = defaultOptions;
    }


    var doc = readChapter(options.source, 1, {targetPath: options.targetPath});
    doc.title = options.title;
    doc.description = options.description;
    doc.headerBgColor = options.headerBgColor;
    doc.headerColor = options.headerColor;
    doc.headerDescriptionColor = options.headerDescriptionColor;
    doc.date = new Date();
    doc.links = collectLinks(doc);
    doc.output = {pdf: options.pdf, html: !options.pdf};
    doc.pdfDownload = options.pdfDownload;
    doc.ctcOnCodeBlock = options.ctcOnCodeBlock;

    if (!options.pdf) {
        doc.toc = false;
    } else {
        doc.toc = options.toc;
    }


    function _renderDoc() {
        var ls = fs.readdirSync(options.source);
        var template = fs.readFileSync(options.template, "UTF-8");
        var html = render(template, doc, options);
        fs.writeFileSync(options.targetHtml, html)
    }

    if (options.maxCommits) {
        require('./git').getChangeLog(options, function (history) {

            doc.history = history;
            history.forEach(function (entry) {
                entry.links = entry.files.map(function (file) {
                    return {
                        link: file,
                        exists: doc.links.indexOf(refToLinkConverter(file)) >= 0
                    }
                });
            });
            _renderDoc();
        })
    } else {
        _renderDoc();
    }
}

module.exports = generate;
