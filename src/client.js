

const s = _el => document.querySelector(_el);
const htmls = (_el, _html) => s(_el).innerHTML = _html;
const append = (_el, _html) => s(_el).insertAdjacentHTML('beforeend', _html);
const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const getHash = () => s4() + s4() +
    '-' + s4() +
    '-' + s4() +
    '-' + s4() +
    '-' + s4() + s4() + s4();

const range = (start, end) => {
    return Array.apply(0, Array(end - start + 1))
        .map((element, index) => index + start);
};

const fadeIn = (el, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    const fade = () => {
        let val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    };
    fade();
};

const borderChar = (px_, color_) => {
    return `
	text-shadow: `+ px_ + `px -` + px_ + `px ` + px_ + `px ` + color_ + `,
							 -`+ px_ + `px ` + px_ + `px ` + px_ + `px ` + color_ + `,
							 -`+ px_ + `px -` + px_ + `px ` + px_ + `px ` + color_ + `,
							 `+ px_ + `px ` + px_ + `px ` + px_ + `px ` + color_ + `;
	`;
};

const renderLang = langs => {
    if (langs[s('html').lang]) return langs[s('html').lang];
    return langs['en'];
};
// s('html').lang = 'en';

const renderSpinner = (IDS) => {
    return /*html*/`
        <div class='in ${IDS}' style='text-align: center; display: none;'>
            <div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
        </div>
    `
};

const renderTable = (data, options) => data[0] ? /*html*/`
        <table>
            <tr> ${Object.keys(data[0]).map(key =>/*html*/`<th class='header-table'>${key}</th>`).join('')} ${options.actions ? '<th></th>' : ''}</tr>
            ${data.map(row => '<tr>' + Object.keys(data[0]).map(key =>/*html*/`<th>${row[key]}</th>`).join('')
    + (options.actions ? options.actions(row) : '') + '</tr>').join('')}
        </table>            
    `: '';

const maxIdComponent = 50;
const errorIcon = /*html*/`<i class='fa fa-exclamation-triangle' aria-hidden='true'></i>`;
const sucessIcon = /*html*/`<i class='fa fa-check-circle' aria-hidden='true'></i>`;

const form_key = {
    init: function (options) {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'form_key-' + s4());
        let labelInputs = [8, 9];
        let inputValueContent = [7, 0];
        let errorsIdInput = [6, 5];
        let url = '/api/keys/create-key';
        let method = 'POST';
        const topLabelInput = '30px';
        const botLabelInput = '0px';
        const mode = options && options.mode == 'search' ? 'search' : 'default';

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

            const generateIdHashInput = () => {
                s('.' + this[IDS][7]).value = getHash();
                s('.' + this[IDS][7]).oninput();
            };

            const resetInputs = () => {
                s('.' + this[IDS][3]).style.display = 'none';
                fadeIn(s('.' + this[IDS][15]));
                [12, 5, 6, 11].map(errorId => s('.' + this[IDS][errorId]).style.display = 'none');
                inputValueContent.map((inputId, i) => {
                    s('.' + this[IDS][inputId]).value = '';
                    s('.' + this[IDS][labelInputs[i]]).style.top = topLabelInput;
                });
                if (mode != 'search') generateIdHashInput();
            };

            checkAllInput(true);
            generateIdHashInput();

            switch (mode) {
                case 'search':
                    [13, 9, 0, 5].map(ID => s('.' + this[IDS][ID]).style.display = 'none');
                    htmls('.' + this[IDS][1], renderLang({ es: 'Buscar', en: 'Search' }));
                    htmls('.' + this[IDS][14], renderLang({ es: 'Buscar llave Asimetrica', en: 'Search Asymmetric key' }));
                    s('.' + this[IDS][7]).value = '';
                    s('.' + this[IDS][7]).disabled = false;
                    s('.' + this[IDS][8]).style.top = topLabelInput;
                    labelInputs = [8];
                    inputValueContent = [7];
                    errorsIdInput = [6];
                    url = '/api/key';
                    method = 'GET';
                    break;
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
                fetch(url + (method == 'GET' ? '/' + s('.' + this[IDS][7]).value : ''), {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: method == 'GET' ? undefined : JSON.stringify({
                        passphrase: s('.' + this[IDS][0]).value,
                        hashId: s('.' + this[IDS][7]).value
                    }),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        resetInputs();
                        if (res.status == 'error') {
                            if (mode == 'search') {
                                console.log('GET ERROR - /key', res.data);
                                return renderMsgInput(11, renderLang({ es: 'Llaves no encontradas', en: 'Keys not found' }));
                            }
                            console.log('POST ERROR - /create-key', res.data);
                            return renderMsgInput(11, errorMsgService);
                        }
                        htmls('.' + this[IDS][2], renderTable(res.data, table_keys.keysActions));
                        fadeIn(s('.' + this[IDS][2]));
                        if (mode == 'search') {
                            console.log('GET SUCCESS - /key', res.data);
                            return renderMsgInput(12, renderLang({ es: 'Llaves encontradas', en: 'Found keys' }), true);
                        }
                        console.log('POST SUCCESS - /create-key', res.data);
                        htmls('table_keys', table_keys.init());
                        return renderMsgInput(12, renderLang({ es: 'Las llaves han sido creadas', en: 'The keys have been created' }), true);
                    }).catch(error => {
                        console.log('POST ERROR - /create-key', error);
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

                  <div class='in label ${this[IDS][8]}' style='top: ${topLabelInput}'>${renderLang({ es: 'Hash ID', en: 'Hash ID' })}</div>
                  <input class='in ${this[IDS][7]}' type='text' disabled>
                  <div class='in error-input ${this[IDS][6]}'></div>

                  <div class='in label ${this[IDS][9]}' style='top: ${topLabelInput}'>${renderLang({ es: 'Contraseña', en: 'Password' })}</div>
                  <input class='in ${this[IDS][0]}' type='password' autocomplete='new-password'>
                  <div class='in error-input ${this[IDS][5]}'></div>
                
                  <button type='submit' class='${this[IDS][1]}'>
                         ${renderLang({ es: 'Crear', en: 'Create' })}
                  </button>
                  <button class='${this[IDS][13]}'>
                         ${renderLang({ es: 'Generar Hash ID', en: 'Generate Hash ID' })}
                  </button>
                  <button type='reset' class='${this[IDS][10]}' style='display: none'>
                         ${renderLang({ es: 'Limpiar', en: 'Reset' })}
                  </button>
                  <div class='in error-input ${this[IDS][11]}'></div>
                </form>
                <div class='in ${this[IDS][2]}' style='display: none;'></div>
                <div class='in success-input ${this[IDS][12]}'></div>
                <button type='reset' class='${this[IDS][15]}' style='display: none'>
                    ${renderLang({ es: 'Crear nueva llave', en: 'Create new Key' })}
                </button>               
                ${renderSpinner(this[IDS][3])}
            </div>
        `
    }
};


const table_keys = {
    getKeys: () => new Promise((resolve, reject) => {
        fetch('/api/keys', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.status == 'error') {
                    console.log('GET ERROR - /keys', res.data);
                    return reject([]);
                }
                console.log('GET SUCCESS - /keys', res.data);
                return resolve(res.data);
            }).catch(error => {
                console.log('GET ERROR - /keys', error);
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
        actions: dataObj => {
            return /*html*/`
                    <th style='text-align: left'> 
                         <button>Descargar Archivos Pem</button>
                         <button>Copiar Llave Publica para Cyberia Online</button>
                    </th>
                `;
        }
    }
};

const main_menu = {
    init: function () {
        const IDS = s4();
        this[IDS] = range(0, maxIdComponent).map(() => 'main_menu-' + s4());
        setTimeout(() => {
            viewPaths.map((path, i) => {
                if (s('.' + this[IDS][i])) s('.' + this[IDS][i]).onclick = () => {
                    viewPaths.map((_path, _i) => {
                        if (_path.path != '/') {
                            if (_path.path != path.path) {
                                s(_path.component).style.display = 'none';
                            } else {
                                fadeIn(s(_path.component));
                            }
                        }
                    });
                    s('.' + this[IDS][viewPaths.length]).style.display = 'none';
                    fadeIn(s('.' + this[IDS][viewPaths.length + 1]));
                };
            });
            s('.' + this[IDS][viewPaths.length + 2]).onclick = () => {
                s('.' + this[IDS][viewPaths.length + 1]).style.display = 'none';
                fadeIn(s('.' + this[IDS][viewPaths.length]));
                viewPaths.map((_path, _i) => {
                    if (_path.path != '/') {
                        s(_path.component).style.display = 'none';
                    }
                });
            };
        });
        return /*html*/`
                <div class='in container ${this[IDS][viewPaths.length]}'>
                ${viewPaths.map((path, i) => path.active ?/*html*/`   

                <button class='${this[IDS][i]}'>${renderLang(path.title)}</button>    
                 
                 `: '').join('')}
                </div>
                <div class='in container ${this[IDS][viewPaths.length + 1]}' style='display: none'>
                        <button class='${this[IDS][viewPaths.length + 2]}'>${renderLang({ es: 'Menu', en: 'Menu' })}</button> 
                </div>
        `
    }
};


append('body', /*html*/`
        <div class='in container main-title' style='${borderChar(1, 'yellow')}'>
               KOYN UI
        </div>
        <main_menu>${main_menu.init()}</main_menu>
        <form_key>${form_key.init()}</form_key>
        <form_key_search>${form_key.init({ mode: 'search' })}</form_key_search>
        <table_keys>${table_keys.init()}</table_keys>
        

`);


//  <table_keys>${table_keys.init()}</table_keys>
