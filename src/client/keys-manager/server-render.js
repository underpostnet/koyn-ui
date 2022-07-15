
const clientID = 'keys-manager';

const mainTitle = 'Koyn UI';

const viewMetaData = {
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
        homePath: '/',
        title: { en: '', es: '' },
        component: 'main_menu',
        options: false,
        menu: false,
        home: false,
        nohome: false,
        render: false
    },
    {
        path: '/keys/create',
        homePath: '/',
        title: { en: 'Create Key', es: 'Crear Llaves' },
        component: 'form_key',
        options: false,
        menu: false,
        home: true,
        nohome: true,
        render: true
    },
    {
        path: '/keys/search',
        homePath: '/',
        title: { en: 'Search Key', es: 'Buscar Llave' },
        component: 'form_key_search',
        options: { origin: 'form_key', mode: 'search' },
        menu: false,
        home: true,
        nohome: true,
        render: true
    },
    {
        path: '/keys/list',
        homePath: '/',
        title: { en: 'Keys List', es: 'Listar Llave' },
        component: 'table_keys',
        options: false,
        menu: false,
        home: true,
        nohome: true,
        render: true
    }
];

export default {
    clientID,
    mainTitle,
    viewMetaData,
    viewPaths
};