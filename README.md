This npm module helps generate a single html page from a set of markdown files, images and plantuml
documents. 


# How to use

Features are best explored by looking into the [documentation](//sinnerschrader.github.io/count-docu/).

# Prerequisite
You have to install pandoc: http://pandoc.org/installing.html

# How to integrate

to start the generation:

````javascript
require('count-docu').generate({})
````

The options available are as follows:

property |default | description
---|---|---
targetPath| {cwd}/dist | path to folder where the generated html is put
source | {cwd}/src | path to folder containing the markdown files 
template | - | path to main handlebars template 
targetHtml| {cwd}/dist/index.html| html file 
title | Documentation | title of documentation
description | .. | description displayed below title
pdf | false | render html for conversion to pdf
pdfDownload| false | add a download link to 'index.pdf'
description | .. | description displayed below title
maxCommits | - | number of git commits to be displayed in history
headerColor|#fff| color of title
headerBgColor|#563d7c| color of header
headerDescriptionColor|#cdbfe3| color of description


# PDF

To render a pdf version use [wkhtmltopdf](http://wkhtmltopdf.org/) (>0.12.4 with patched qt) which renders proper links and table of content

````shell 
wkhtmltopdf --page-size A4 --viewport-size 1024x768 --disable-smart-shrinking --zoom 5.5 --outline dist/pdf.html dist/index.pdf
````

# Credits

## Plantuml
This software includes the awesome plantuml library (MIT license) from [plantuml.com](//www.plantuml.com)

## node-plantuml

Modified bits and pieces from [node-plantuml)](https://github.com/markushedvall/node-plantuml) are included in this software.
