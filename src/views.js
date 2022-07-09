const fs = require('fs');
const express = require('express');

// -------------------------------------------------------------
// -------------------------------------------------------------

const title = 'Koyn UI';

const viewMetaData = {
    favicon: {
        type: 'image/png',
        path: '/assets/underpost.png'
    },
    lang: 'en',
    charset: 'utf-8',
    dir: 'ltr',
    router: './src/client.js'
};

const views = [
    {
        path: '/',
        title: ''
    },
    {
        path: '/create-key',
        title: 'Create Key'
    }
];

// -------------------------------------------------------------
// -------------------------------------------------------------

const renderView = dataView => /*html*/`
            <!DOCTYPE html>
            <html dir='${dataView.dir}' lang='${dataView.lang}'>
                <head>
                    <meta charset='${dataView.charset}'>
                    <title> ${dataView.title != '' ? dataView.title + ' - ' : ''}${title} </title>
                    <link rel='icon' type='${dataView.favicon.type}' href='${dataView.favicon.path}'>
                    <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
                    <style>${fs.readFileSync('./src/assets/style/global.css', dataView.charset)}</style>
                </head>
                <body>                  
                    <script>${fs.readFileSync(dataView.router, dataView.charset)}</script>
                </body>
            </html>

`;

// -------------------------------------------------------------
// -------------------------------------------------------------

module.exports = (app) => {
    app.use('/assets', express.static('./src/assets'));

    const renders = views.map(view => {
        return {
            path: view.path,
            render: renderView({
                ...view,
                ...viewMetaData
            })
        };
    });

    renders.map(view => app.get(view.path,
        (req, res) => res.end(view.render)));
};