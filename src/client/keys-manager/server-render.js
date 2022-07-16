
const clientID = 'keys-manager';
const viewMetaData = {
    clientID,
    mainTitle: 'Koyn UI',
    favicon: {
        type: 'image/png',
        path: '/assets/favicon.png'
    },
    lang: 'es',
    charset: 'utf-8',
    dir: 'ltr',
    router: `./src/client/${clientID}/client-core.js`,
    styles: [
        `./src/client/${clientID}/assets/style/global.css`,
        `./src/client/${clientID}/assets/style/spinner-ellipsis.css`
    ]
};

// module render group
const viewPaths = [
    {
        path: '/',
        homePaths: ['/'],
        title: { en: '', es: '' },
        component: 'main_menu',
        options: false,
        menu: false,
        home: true,
        nohome: true,
        render: true
    },
    {
        path: '/keys/create',
        homePaths: ['/'],
        title: { en: 'Create Key', es: 'Crear Llaves' },
        component: 'form_key',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true
    },
    {
        path: '/keys/search',
        homePaths: ['/'],
        title: { en: 'Search Key', es: 'Buscar Llave' },
        component: 'form_key_search',
        options: { origin: 'form_key', mode: 'search' },
        menu: true,
        home: false,
        nohome: false,
        render: true
    },
    {
        path: '/keys/list',
        homePaths: ['/'],
        title: { en: 'Keys List', es: 'Listar Llave' },
        component: 'table_keys',
        options: false,
        menu: true,
        home: false,
        nohome: false,
        render: true
    }
];

export {
    viewMetaData,
    viewPaths
};