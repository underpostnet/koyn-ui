

(() => {

    const s = _el => document.querySelector(_el);
    const htmls = (_el, _html) => s(_el).innerHTML = _html;
    const append = (_el, _html) => s(_el).insertAdjacentHTML('beforeend', _html);
    const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
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

    const CREATE_KEY = {
        IDS: range(0, maxIdComponent).map(() => 'CREATE_KEY-' + s4()),
        init: function () {
            const labelInputs = [8, 9];
            const inputValueContent = [7, 0];
            const errorsIdInput = [6, 5];
            const topLabelInput = '30px';
            const botLabelInput = '0px';

            setTimeout(() => {

                const renderMsgInput = (IDS, MSG, STATUS) => {
                    htmls('.' + this.IDS[IDS], (STATUS ? sucessIcon : errorIcon) + MSG);
                    fadeIn(s('.' + this.IDS[IDS]));
                };

                const checkInput = (i, inputId) => {
                    if (s('.' + this.IDS[inputId]).value == '') {
                        s('.' + this.IDS[labelInputs[i]]).style.top = topLabelInput;
                        renderMsgInput(errorsIdInput[i], renderLang({ es: 'Campo vacio', en: 'Empty Field' }));
                        return false;
                    }
                    s('.' + this.IDS[labelInputs[i]]).style.top = botLabelInput;
                    s('.' + this.IDS[errorsIdInput[i]]).style.display = 'none';
                    return true;
                };

                const checkAllInput = (setEvent) => inputValueContent.map((inputId, i) => {
                    if (setEvent) {
                        s('.' + this.IDS[inputId]).onblur = () =>
                            checkInput(i, inputId);
                        s('.' + this.IDS[inputId]).oninput = () =>
                            checkInput(i, inputId);
                        s('.' + this.IDS[labelInputs[i]]).onclick = () =>
                            s('.' + this.IDS[inputId]).focus();
                        s('.' + this.IDS[inputId]).onclick = () =>
                            s('.' + this.IDS[labelInputs[i]]).style.top = botLabelInput;
                        s('.' + this.IDS[inputId]).onfocus = () =>
                            s('.' + this.IDS[labelInputs[i]]).style.top = botLabelInput;
                        return;
                    };
                    return s('.' + this.IDS[inputId]).oninput();
                }).filter(x => x == false).length === 0;

                const resetInputs = () => {
                    s('.' + this.IDS[3]).style.display = 'none';
                    fadeIn(s('.' + this.IDS[4]));
                    [12, 5, 6, 11].map(errorId => s('.' + this.IDS[errorId]).style.display = 'none');
                    inputValueContent.map((inputId, i) => {
                        s('.' + this.IDS[inputId]).value = '';
                        s('.' + this.IDS[labelInputs[i]]).style.top = topLabelInput;
                    });
                };

                checkAllInput(true);
                s('.' + this.IDS[10]).onclick = e => setTimeout(() => resetInputs());
                s('.' + this.IDS[1]).onclick = e => {
                    e.preventDefault();
                    console.log('onclick', s('.' + this.IDS[0]).value);
                    if (!checkAllInput()) return;
                    s('.' + this.IDS[2]).style.display = 'none';
                    s('.' + this.IDS[4]).style.display = 'none';
                    fadeIn(s('.' + this.IDS[3]));
                    const errorMsgService =
                        renderLang({ es: 'Error en el Servicio', en: 'Service Error' });
                    fetch('/api/keys/create-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            passphrase: s('.' + this.IDS[0]).value,
                            name: s('.' + this.IDS[7]).value
                        }),
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            resetInputs();
                            if (res.status == 'error') {
                                console.log('POST ERROR - /create-key', res.data);
                                return renderMsgInput(11, errorMsgService);
                            }
                            console.log('POST SUCCESS - /create-key', res.data);
                            htmls('.' + this.IDS[2], res.data.privateKey);
                            fadeIn(s('.' + this.IDS[2]));
                            return renderMsgInput(12, renderLang({ es: 'Las llaves han sido creadas', en: 'The keys have been created' }), true);
                        }).catch(error => {
                            console.log('POST ERROR - /create-key', error);
                            return renderMsgInput(11, errorMsgService);
                        });

                };
            });
            return /*html*/`
            <div class='in container'>
                <form class='in ${this.IDS[4]}'>

                   <div class='in title'>
                       <i class='fa fa-key' aria-hidden='true'></i>
                       ${renderLang({ es: 'Crear llaves', en: 'Create keys' })}
                   </div>

                  <div class='in label ${this.IDS[8]}' style='top: ${topLabelInput}'>${renderLang({ es: 'Nombre', en: 'Name' })}</div>
                  <input class='in ${this.IDS[7]}' type='text'>
                  <div class='in error-input ${this.IDS[6]}'></div>

                  <div class='in label ${this.IDS[9]}' style='top: ${topLabelInput}'>${renderLang({ es: 'Contraseña', en: 'Password' })}</div>
                  <input class='in ${this.IDS[0]}' type='password' autocomplete='new-password'>
                  <div class='in error-input ${this.IDS[5]}'></div>

                  <button type='submit' class='${this.IDS[1]}'>
                         ${renderLang({ es: 'Crear', en: 'Create' })}
                  </button>
                  <button type='reset' class='${this.IDS[10]}'>
                         ${renderLang({ es: 'Limpiar', en: 'Reset' })}
                  </button>
                  <div class='in success-input ${this.IDS[12]}'></div>
                  <div class='in error-input ${this.IDS[11]}'></div>
                </form>
                <pre class='in ${this.IDS[2]}' style='display: none;'></pre>
                
                ${renderSpinner(this.IDS[3])}
            </div>
        `
        }
    };


    const TABLE_KEYS = {
        IDS: range(0, maxIdComponent).map(() => 'TABLE_KEYS-' + s4()),
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
        renderTable: async function () {
            s('.' + this.IDS[0]).style.display = 'none';
            fadeIn(s('.' + this.IDS[1]));
            const data = await this.getKeys();
            htmls('.' + this.IDS[0], renderTable(data, {
                actions: dataObj => {
                    return /*html*/`
                        <th> 
                             <i class='fa fa-eye' aria-hidden='true'></i> 
                             <i class='fa fa-trash' aria-hidden='true'></i>
                             <i class='fa fa-pencil' aria-hidden='true'></i>
                             <i class='fa fa-download' aria-hidden='true'></i>
                        </th>
                    `;
                }
            }));
            s('.' + this.IDS[1]).style.display = 'none';
            fadeIn(s('.' + this.IDS[0]));
        },
        init: function () {
            setTimeout(() => this.renderTable());
            return /*html*/`
            <div class='in container'>
                ${renderSpinner(this.IDS[1])}
                <div class='in ${this.IDS[0]}' style='display: none'></div>
            </div>
        `;
        }
    };


    append('body', /*html*/`
        <div class='in container main-title' style='${borderChar(1, 'yellow')}'>
               KOYN UI
        </div>
        ${CREATE_KEY.init()}
        ${TABLE_KEYS.init()}

`);

})();
