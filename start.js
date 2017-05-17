require('./src/index').generate({
    docGitPath: 'doc',
    source: process.cwd()+'/doc',
    pdfDownload: true,
    ctcOnCodeBlock : true
});

