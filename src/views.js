'use strict';

import fs from 'fs';
import express from 'express';

// -------------------------------------------------------------
// -------------------------------------------------------------

const title = 'Koyn UI';

const viewMetaData = {
    favicon: {
        type: 'image/png',
        path: '/assets/underpost.png'
    },
    lang: 'es',
    charset: 'utf-8',
    dir: 'ltr',
    router: './src/client.js'
};

// module render group
const viewPaths = [
    {
        path: '/',
        title: { en: '', es: '' },
        component: 'main_menu',
        options: false,
        menu: false,
        home: true,
        fix: false,
        render: true
    },
    {
        path: '/keys/create',
        title: { en: 'Create Key', es: 'Crear Llaves' },
        component: 'form_key',
        options: false,
        menu: true,
        home: false,
        fix: false,
        render: true
    },
    {
        path: '/keys/search',
        title: { en: 'Search Key', es: 'Buscar Llave' },
        component: 'form_key_search',
        options: { origin: 'form_key', mode: 'search' },
        menu: true,
        home: false,
        fix: false,
        render: true
    },
    {
        path: '/keys/list',
        title: { en: 'Keys List', es: 'Listar Llave' },
        component: 'table_keys',
        options: false,
        menu: false,
        home: true,
        fix: true,
        render: true
    }
];

// -------------------------------------------------------------
// -------------------------------------------------------------

const renderView = dataView => /*html*/`
            <!DOCTYPE html>
            <html dir='${dataView.dir}' lang='${dataView.lang}'>
                <head>
                    <meta charset='${dataView.charset}'>
                    <title> ${dataView.title[dataView.lang] != '' ? dataView.title[dataView.lang] + ' - ' : ''}${title} </title>
                    <link rel='icon' type='${dataView.favicon.type}' href='${dataView.favicon.path}'>
                    <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
                    <style>
                        ${fs.readFileSync('./src/assets/style/base.css', dataView.charset)}
                        ${fs.readFileSync('./src/assets/style/global.css', dataView.charset)}
                        ${fs.readFileSync('./src/assets/style/spinner.css', dataView.charset)}
                        ${viewPaths.filter(path => path.render).map(path => !path.home ? path.component + `{ display: none; }` : '').join('')}
                    </style>
                    <link rel='stylesheet' href='/fontawesome/all.min.css'>
                </head>
                <body>                  
                    <script>
                            (function(){
                                const viewPaths = JSON.parse('${JSON.stringify(viewPaths.filter(path => path.render))}');
                                console.log('viewPaths', viewPaths);
                                ${fs.readFileSync(dataView.router, dataView.charset)}
                            })();
                    </script>
                </body>
            </html>

`;

// -------------------------------------------------------------
// -------------------------------------------------------------

export const views = (app) => {
    app.use('/assets', express.static('./src/assets'));
    app.use('/fontawesome', express.static('./node_modules/@fortawesome/fontawesome-free/css'));
    app.use('/webfonts', express.static('./node_modules/@fortawesome/fontawesome-free/webfonts'));

    const renders = viewPaths.map(view => {
        return {
            path: view.path,
            render: renderView({
                ...view,
                ...viewMetaData
            })
        };
    });

    renders.map(view => app.get(view.path,
        (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            return res.status(200).end(view.render);
        }));

    return {
        title,
        viewMetaData,
        viewPaths,
        renderView
    }
};