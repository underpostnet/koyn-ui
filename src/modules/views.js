'use strict';

import fs from 'fs';
import express from 'express';
import parser from 'ua-parser-js';
import UglifyJS from 'uglify-js';
import CleanCSS from 'clean-css';
import { logger } from './logger.js';

const cssClientCore = `html{scroll-behavior:smooth}.fl{position:relative;display:flow-root}.abs,.in{display:block}.fll{float:left}.flr{float:right}.abs{position:absolute}.in,.inl{position:relative}.inl{display:inline-table}.fix{position:fixed;display:block}.center{transform:translate(-50%,-50%);top:50%;left:50%;width:100%;text-align:center}`;

const renderView = dataView => {
    const jsClientCore = `(function(){
        const viewPaths = JSON.parse('${JSON.stringify(dataView.viewPaths.filter(path => path.render))}');
        console.log('viewPaths', viewPaths);
        ${fs.readFileSync(dataView.router, dataView.charset)}
    })()`;
    return /*html*/`
    <!DOCTYPE html>
    <html dir='${dataView.dir}' lang='${dataView.lang}'>
        <head>
            <meta charset='${dataView.charset}'>
            <title> ${dataView.title[dataView.lang] != '' ? dataView.title[dataView.lang] + ' - ' : ''}${dataView.mainTitle} </title>
            <link rel='icon' type='${dataView.favicon.type}' href='${dataView.favicon.path}'>
            <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, user-scalable=0'>
            <style>
                ${new CleanCSS().minify(cssClientCore
        + dataView.viewMetaData.styles.map(dirStyle => fs.readFileSync(dirStyle, dataView.charset)).join('')
        + dataView.viewPaths.filter(path => path.render).map(path => !path.home ? path.component + `{ display: none; }` : '').join('')
    ).styles}
            </style>
            <link rel='stylesheet' href='/fontawesome/all.min.css'>
        </head>
        <body>                  
            <script>
                ${process.env.NODE_ENV == 'development' ? jsClientCore : UglifyJS.minify(jsClientCore).code}
            </script>
        </body>
    </html>

`;
};

// -------------------------------------------------------------
// -------------------------------------------------------------

export const views = (app, renderData) => {

    const {
        clientID,
        mainTitle,
        viewMetaData,
        viewPaths
    } = renderData;

    app.use('/assets', express.static(`./src/client/${clientID}/assets`));
    app.use('/fontawesome', express.static(`./node_modules/@fortawesome/fontawesome-free/css`));
    app.use('/webfonts', express.static(`./node_modules/@fortawesome/fontawesome-free/webfonts`));

    const renders = viewPaths.map(view => {
        return {
            path: view.path,
            render: renderView({
                ...view,
                ...viewMetaData,
                ...renderData
            })
        };
    });

    renders.map(view => app.get(view.path,
        (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            logger.info(parser(req.headers['user-agent']));
            return res.status(200).end(view.render);
        }));

};