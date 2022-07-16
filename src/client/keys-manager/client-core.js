
const maxIdComponent = 50;
const errorIcon = /*html*/`<i class='fa fa-exclamation-triangle' aria-hidden='true'></i>`;
const sucessIcon = /*html*/`<i class='fa fa-check-circle' aria-hidden='true'></i>`;
const uriApi = 'keys';

this.form_key = {
    init: function (options) {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'form_key-' + s4());
        let labelInputs = [8, 9];
        let inputValueContent = [7, 0];
        let errorsIdInput = [6, 5];
        let url = () => `/api/${uriApi}/create-key`;
        let method = 'POST';
        const topLabelInput = '30px';
        const botLabelInput = '0px';
        const mode = options && options.mode ? options.mode : 'default';

        setTimeout(() => {

            const renderMsgInput = (ID, MSG, STATUS) => {
                htmls('.' + this[IDS][ID], (STATUS ? sucessIcon : errorIcon) + MSG);
                fadeIn(s('.' + this[IDS][ID]));
            };

            const checkInput = (i, inputId) => {
                if (s('.' + this[IDS][inputId]).value == '') {
                    s('.' + this[IDS][labelInputs[i]]).style.top = topLabelInput;
                    renderMsgInput(errorsIdInput[i], renderLang({ es: 'Campo vacio', en: 'Empty Field' }));
                    return false;
                }
                s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                s('.' + this[IDS][errorsIdInput[i]]).style.display = 'none';
                return true;
            };

            const checkAllInput = (setEvent) => inputValueContent.map((inputId, i) => {
                if (setEvent) {
                    s('.' + this[IDS][inputId]).onblur = () =>
                        checkInput(i, inputId);
                    s('.' + this[IDS][inputId]).oninput = () =>
                        checkInput(i, inputId);
                    s('.' + this[IDS][labelInputs[i]]).onclick = () =>
                        s('.' + this[IDS][inputId]).focus();
                    s('.' + this[IDS][inputId]).onclick = () =>
                        s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                    s('.' + this[IDS][inputId]).onfocus = () =>
                        s('.' + this[IDS][labelInputs[i]]).style.top = botLabelInput;
                    return;
                };
                return s('.' + this[IDS][inputId]).oninput();
            }).filter(x => x == false).length === 0;

            const displayHashInput = () => {
                fadeIn(s('.' + this[IDS][8]));
                fadeIn(s('.' + this[IDS][7]));
            };
            const generateIdHashInput = () => {
                s('.' + this[IDS][7]).value = getHash();
                s('.' + this[IDS][7]).oninput();
            };

            const resetInputs = () => {
                s('.' + this[IDS][3]).style.display = 'none';
                mode == 'search' ? fadeIn(s('.' + this[IDS][4])) : fadeIn(s('.' + this[IDS][15]));
                [12, 5, 6, 11].map(errorId => s('.' + this[IDS][errorId]).style.display = 'none');
                inputValueContent.map((inputId, i) => {
                    s('.' + this[IDS][inputId]).value = '';
                    s('.' + this[IDS][labelInputs[i]]).style.top = topLabelInput;
                });
                if (mode == 'default') generateIdHashInput();
            };

            checkAllInput(true);
            generateIdHashInput();

            switch (mode) {
                case 'search':
                    [13, 9, 0, 5, 16].map(ID => s('.' + this[IDS][ID]).style.display = 'none');
                    htmls('.' + this[IDS][1], renderLang({ es: 'Buscar', en: 'Search' }));
                    htmls('.' + this[IDS][14], renderLang({ es: 'Buscar llave Asimetrica', en: 'Search Asymmetric key' }));
                    s('.' + this[IDS][7]).value = '';
                    s('.' + this[IDS][7]).disabled = false;
                    s('.' + this[IDS][8]).style.top = topLabelInput;
                    displayHashInput();
                    labelInputs = [8];
                    inputValueContent = [7];
                    errorsIdInput = [6];
                    url = () => `/api/${uriApi}/` + s('.' + this[IDS][7]).value;
                    method = 'GET';
                    break;
                case 'copy-cyberia-key':
                    [13, 16].map(ID => s('.' + this[IDS][ID]).style.display = 'none');
                    [18, 19].map(ID => fadeIn(s('.' + this[IDS][ID])));
                    displayHashInput();
                    labelInputs.push(18);
                    inputValueContent.push(19);
                    errorsIdInput.push(20);
                    checkAllInput(true);
                    htmls('.' + this[IDS][1], renderLang({ es: 'Generar Copia', en: 'Generate Copy' }));
                    s('.' + this[IDS][7]).value = options.data['Hash ID'];
                    htmls('.' + this[IDS][14], renderLang({ es: 'Copiar Llave Publica para Cyberia Online', en: 'Copy Public Key for Cyberia Online' }));
                    url = () => `/api/${uriApi}/copy-cyberia`;
                    break;
                case 'link-item-cyberia':
                    [13, 16].map(ID => s('.' + this[IDS][ID]).style.display = 'none');
                    [21, 22, 24, 25].map(ID => fadeIn(s('.' + this[IDS][ID])));
                    labelInputs.push(21);
                    inputValueContent.push(22);
                    errorsIdInput.push(23);
                    labelInputs.push(24);
                    inputValueContent.push(25);
                    errorsIdInput.push(26);
                    displayHashInput();
                    checkAllInput(true);
                    htmls('.' + this[IDS][1], renderLang({ es: 'Transferir', en: 'Transfer' }));
                    s('.' + this[IDS][7]).value = options.data['Hash ID'];
                    htmls('.' + this[IDS][14], renderLang({ es: 'Vincular Ítem de Cyberia en LLave Pública', en: 'Link Cyberia Item to Public Key' }));
                    url = () => `/api/${uriApi}/transaction/cyberia-link-item`;
                    break;
                case 'copy-cli-key':
                    [1, 16].map(ID => s('.' + this[IDS][ID]).style.display = 'none');
                    [28].map(ID => fadeIn(s('.' + this[IDS][ID]), 'inline-table'));
                    s('.' + this[IDS][7]).value = options.data['Hash ID'];
                    htmls('.' + this[IDS][14], renderLang({ es: 'Copiar Llaves para CLI', en: 'Copy Keys for CLI' }));
                    displayHashInput();
                    s('.' + this[IDS][28]).onclick = e => {
                        e.preventDefault();
                        s('.' + this[IDS][1]).click();
                        // si ya fue obtenido simplemente copiar
                    };
                    url = () => `/api/${uriApi}/copy-cli-key`;
            }

            s('.' + this[IDS][10]).onclick = e => setTimeout(() => resetInputs());
            s('.' + this[IDS][1]).onclick = e => {
                e.preventDefault();
                console.log('onclick', s('.' + this[IDS][0]).value);
                if (!checkAllInput()) return;
                s('.' + this[IDS][2]).style.display = 'none';
                s('.' + this[IDS][4]).style.display = 'none';
                s('.' + this[IDS][12]).style.display = 'none';
                fadeIn(s('.' + this[IDS][3]));
                const errorMsgService =
                    renderLang({ es: 'Error en el Servicio', en: 'Service Error' });

                fetch(url(), {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: method == 'GET' ? undefined : JSON.stringify({
                        passphrase: s('.' + this[IDS][0]).value,
                        hashId: s('.' + this[IDS][7]).value,
                        cyberiaAuthToken: s('.' + this[IDS][19]).value,
                        subject: s('.' + this[IDS][22]).value,
                        amount: s('.' + this[IDS][25]).value
                    }),
                })
                    .then((res) => {
                        console.log(url(), res);
                        return res.json();
                    })
                    .then((res) => {
                        if (mode == 'copy-cli-key') {
                            console.log('POST', url(), res);
                            return;
                        }
                        if (mode == 'copy-cyberia-key') {
                            console.log('POST', url(), res);
                            if (res.status == 'success') {
                                htmls('.' + this[IDS][27], res.data);
                                fadeIn(s('.' + this[IDS][4]));
                                fadeIn(s('.' + this[IDS][27]));
                                fadeIn(s('.' + this[IDS][28]), 'inline-table');
                                s('.' + this[IDS][3]).style.display = 'none';
                                s('.' + this[IDS][28]).onclick = e => {
                                    e.preventDefault();
                                    copyData(res.data);
                                    renderMsgInput(12, renderLang({ es: 'Llaves copiadas con exito', en: 'Successfully copied Key' }), true);
                                };
                                return s('.' + this[IDS][28]).click();
                            } else {

                            }
                            return;
                        }
                        if (mode == 'link-item-cyberia') {
                            console.log('POST', url(), res);
                            return;
                        }
                        resetInputs();
                        if (res.status == 'error') {
                            if (mode == 'search') {
                                console.log('GET ERROR', url(), res.data);
                                return renderMsgInput(11, renderLang({ es: 'Llaves no encontradas', en: 'Keys not found' }));
                            }
                            console.log('POST ERROR', url(), res.data);
                            return renderMsgInput(11, errorMsgService);
                        }
                        htmls('.' + this[IDS][2], renderTable(res.data, table_keys.keysActions));
                        fadeIn(s('.' + this[IDS][2]));
                        if (mode == 'search') {
                            console.log('GET SUCCESS', url(), res.data);
                            return renderMsgInput(12, renderLang({ es: 'Llaves encontradas', en: 'Found keys' }), true);
                        }
                        console.log('POST SUCCESS', url(), res.data);
                        if (s('table_keys')) htmls('table_keys', table_keys.init());
                        return renderMsgInput(12, renderLang({ es: 'Las llaves han sido creadas', en: 'The keys have been created' }), true);
                    }).catch(error => {
                        console.log('KEYS SERVICE ERROR', url(), error);
                        return renderMsgInput(11, errorMsgService);
                    });

            };
            s('.' + this[IDS][13]).onclick = e => {
                e.preventDefault();
                generateIdHashInput();
            };
            s('.' + this[IDS][15]).onclick = e => {
                e.preventDefault();
                resetInputs();
                s('.' + this[IDS][2]).style.display = 'none';
                s('.' + this[IDS][15]).style.display = 'none';
                fadeIn(s('.' + this[IDS][4]));
            };
            let openKeyConfig = false;
            s('.' + this[IDS][16]).onclick = e => {
                e.preventDefault();
                if (openKeyConfig) {
                    openKeyConfig = false;
                    htmls('.' + this[IDS][16], renderLang({ es: 'Ver Configuración', en: 'See Configuration' }));
                    s('.' + this[IDS][17]).style.display = 'none';
                } else {
                    openKeyConfig = true;
                    htmls('.' + this[IDS][16], renderLang({ es: 'Ocultar Configuración', en: 'Hide Configuration' }));
                    fadeIn(s('.' + this[IDS][17]));
                }
            };
        });
        return /*html*/`
            <div class='in container'>
                <div class='in title'>
                    <i class='fa fa-key' aria-hidden='true'></i>
                    <span class='${this[IDS][14]}'>
                        ${renderLang({ es: 'Crear llaves Asimetricas', en: 'Create Asymmetric keys' })}
                    </span>
                </div>
                <form class='in ${this[IDS][4]}'>

                  <div class='in label ${this[IDS][8]}' style='top: ${topLabelInput}; display: none'>${renderLang({ es: 'Hash ID', en: 'Hash ID' })}</div>
                  <input class='in ${this[IDS][7]}' type='text' style='display: none' disabled autocomplete='off'>
                  <div class='in error-input ${this[IDS][6]}'></div>

                  <div class='in label ${this[IDS][18]}' style='top: ${topLabelInput}; display: none'>${renderLang({ es: 'Cyberia Auth Token', en: 'Cyberia Auth Token' })}</div>
                  <input class='in ${this[IDS][19]}' type='text' style='display: none' autocomplete='off'>
                  <div class='in error-input ${this[IDS][20]}'></div>

                
                  <div class='in label ${this[IDS][21]}' style='top: ${topLabelInput}; display: none'>
                         ${renderLang({ es: 'Token de Transacción', en: 'Transaction Token' })}
                  </div>
                  <input class='in ${this[IDS][22]}' type='text' style='display: none' autocomplete='off'>
                  <div class='in error-input ${this[IDS][23]}'></div>


                  <div class='in label ${this[IDS][24]}' style='top: ${topLabelInput}; display: none'>
                         ${renderLang({ es: 'Monto', en: 'Amount' })}
                  </div>
                  <input class='in ${this[IDS][25]}' type='number' style='display: none' autocomplete='off'>
                  <div class='in error-input ${this[IDS][26]}'></div>

                  <div class='in label ${this[IDS][9]}' style='top: ${topLabelInput}'>${renderLang({ es: 'Contraseña', en: 'Password' })}</div>
                  <input class='in ${this[IDS][0]}' type='password' autocomplete='new-password'>
                  <div class='in error-input ${this[IDS][5]}'></div>

                  <pre class='in ${this[IDS][27]}' style='display: none'></pre>

                  <pre class='in ${this[IDS][17]}' style='display: none'>${JSON.stringify({
            type: 'rsa',
            modulusLength: 4096,
            namedCurve: 'secp256k1',
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc'
            }
        }, null, 4)}</pre>
                
                  <button type='submit' class='${this[IDS][1]}'>
                         ${renderLang({ es: 'Crear', en: 'Create' })}
                  </button>
                  <button class='${this[IDS][13]}' style='display: none'>
                         ${renderLang({ es: 'Generar Hash ID', en: 'Generate Hash ID' })}
                  </button>
                  <button type='reset' class='${this[IDS][10]}' style='display: none'>
                         ${renderLang({ es: 'Limpiar', en: 'Reset' })}
                  </button>
                  <button class='${this[IDS][16]}'>
                         ${renderLang({ es: 'Ver Configuración', en: 'See Configuration' })}
                  </button>
                  <button class='${this[IDS][28]}' style='display: none'>
                         ${renderLang({ es: 'Copiar', en: 'Copy' })}
                  </button>
                  ${options && options.buttons ? options.buttons.join('') : ''}
                </form>
                <div class='in ${this[IDS][2]}' style='display: none;'></div>
                <div class='in error-input ${this[IDS][11]}'></div>
                <div class='in success-input ${this[IDS][12]}'></div>
                <button type='reset' class='${this[IDS][15]}' style='display: none'>
                    ${renderLang({ es: 'Crear nueva llave', en: 'Create new Key' })}
                </button>               
                ${renderSpinner(this[IDS][3])}
            </div>
        `
    }
};


this.table_keys = {
    getKeys: () => new Promise((resolve, reject) => {
        const url = () => `/api/${uriApi}`;
        fetch(url(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 'error') {
                    console.log('GET ERROR', url(), res.data);
                    return reject([]);
                }
                console.log('GET SUCCESS', url(), res.data);
                return resolve(res.data);
            }).catch(error => {
                console.log('GET ERROR', url(), error);
                return reject([]);
            });
    }),
    renderTable: async function (IDS) {
        s('.' + this[IDS][0]).style.display = 'none';
        fadeIn(s('.' + this[IDS][1]));
        const data = await this.getKeys();
        htmls('.' + this[IDS][0], renderTable(data, this.keysActions));
        s('.' + this[IDS][1]).style.display = 'none';
        fadeIn(s('.' + this[IDS][0]));
    },
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'table_keys-' + s4());
        setTimeout(() => this.renderTable(IDS));
        return /*html*/`
            <div class='in container'>
                <div class='in title'>
                    <i class='fa fa-key' aria-hidden='true'></i>
                    ${renderLang({ es: 'Lista de llaves Asimetricas', en: 'Asymmetric keys List' })}
                </div>
                ${renderSpinner(this[IDS][1])}
                <div class='in ${this[IDS][0]}' style='display: none'></div>
            </div>
        `;
    },
    keysActions: {
        actions: function (dataObj) {
            const IDS = s4();
            const openModalAction = (mode) => {
                htmls('modal', GLOBAL.form_key.init({
                    mode,
                    buttons: [
                        /*html*/`<button class='${this[IDS][2]}'>${renderLang({ es: 'Volver', en: 'Back' })}</button>`
                    ],
                    data: dataObj
                }));
                s('main').style.display = 'none';
                fadeIn(s('modal'));
                s('.' + this[IDS][2]).onclick = () => {
                    s('modal').style.display = 'none';
                    htmls('modal', '');
                    fadeIn(s('main'));
                }
            };
            this[IDS] = range(0, maxIdComponent).map(() => 'keysActions-' + s4());
            setTimeout(() => {
                s('.' + this[IDS][0]).onclick = () => {
                    console.log('copy cyberia', dataObj);
                    openModalAction('copy-cyberia-key');
                };
                s('.' + this[IDS][3]).onclick = () => {
                    console.log('link item cyberia', dataObj);
                    openModalAction('link-item-cyberia');
                };
                s('.' + this[IDS][1]).onclick = () => {
                    console.log('copy cli key', dataObj);
                    openModalAction('copy-cli-key');
                };
            });
            return /*html*/`
                    <th style='text-align: left'> 
                         <button class='${this[IDS][1]}'>${renderLang({ es: 'Copiar Llaves para CLI', en: 'Copy Keys for CLI' })}</button>
                         <button class='${this[IDS][0]}'>${renderLang({ es: 'Copiar Llave Publica para Cyberia Online', en: 'Copy Public Key for Cyberia Online' })}</button>
                         <button class='${this[IDS][3]}'>${renderLang({ es: 'Vincular Ítem de Cyberia en LLave Pública', en: 'Link Cyberia Item to Public Key' })}</button>
                    </th>
                `;
        }
    }
};

this.main_menu = {
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'main_menu-' + s4());
        setTimeout(() => {
            viewPaths.map((path, i) => {

                if (s('.' + this[IDS][i])) s('.' + this[IDS][i]).onclick = () => {
                    console.log('main_menu onclick', path);
                    return GLOBAL.router({ newPath: path.path });
                }

            });

        });
        return /*html*/`
                <div class='in container ${this[IDS][viewPaths.length]}'>
                ${viewPaths.map((path, i) => path.menu ?/*html*/`   

                <button class='${this[IDS][i]}'>${renderLang(path.title)}</button>    
                 
                 `: '').join('')}
                </div>
                <div class='in container ${this[IDS][viewPaths.length + 1]}' style='display: none'>
                        <button class='${this[IDS][viewPaths.length + 2]}'>${renderLang({ es: 'Menu', en: 'Menu' })}</button> 
                </div>
        `
    }
};

this.router = options => {
    console.log('INIT ROUTER', options);
    let valid = false;
    const testEvalPath = options && options.newPath ? options.newPath : view.path;
    viewPaths.map((path, i) => {
        const testIncludesHome = path.homePaths.includes(testEvalPath);
        const validPath = path.path == testEvalPath;
        // console.log('-------------------------------------');
        // console.log('router options', options);
        // console.log('testEvalPath', testEvalPath);
        // console.log('testIncludesHome', testIncludesHome);
        if (validPath) {
            valid = true;
            if (testEvalPath != getURI()) {
                setURI(testEvalPath);
                htmls('title', (renderLang(path.title) == '' ? '' : renderLang(path.title) + ' - ')
                    + viewMetaData.mainTitle);
            };
        };
        // if (validPath && (testEvalPath != view.path)) setURI(testEvalPath);
        if (validPath
            || (path.home && testIncludesHome)
            || (path.nohome && (!testIncludesHome))
        ) {
            fadeIn(s(path.component));
        } else {
            s(path.component).style.display = 'none';
        }
    });
    if (!valid) location.href = testEvalPath;
};

//  Asymmetric Key Manager
append('body', /*html*/`
        <div class='in container banner' style='${borderChar(1, 'yellow')}'>
               KO<span class='inl' style='color: red; font-size: 50px; top: 5px; ${borderChar(1, 'white')}'>λ</span>N
               <br>
               Wallet
        </div>
        <div class='in container'>
            CyberiaOnline Asymmetric Key Manager
        </div>
        <modal></modal>
        <main>
        ${viewPaths.map(path =>/*html*/`
        <${path.component}>${this[path.options ? path.options.origin : path.component].init(path.options)}</${path.component}>
        `).join('')}
        </main>
        <footer>
            <div class='in container' style='text-align: right'>
                Source Code
                <img src='/assets/github.png' class='inl' style='width: 20px; top: 5px'> 
                <a href='https://github.com/underpostnet/koyn-ui'>GitHub</a>
                <br>
                Developed By
                <img src='/assets/underpost.png' class='inl' style='width: 23px; top: 5px; left: 3px'> 
                <a href='https://underpost.net/'>UNDERpost.net</a>
            </div> 
        </footer>
       
        

`);

this.router();

// Browser and App
// navigator button controller
window.onpopstate = e =>
    this.router({ newPath: getURI() });
