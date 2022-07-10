

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
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    };
    fade();
};

const renderLang = langs => {
    if (langs[s('html').lang]) return langs[s('html').lang];
    return langs['en'];
};
// s('html').lang = 'en';

const spinner = /*html*/`
             <div class='inl'>
                  <div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
             </div>
`;


const errorIcon = /*html*/`<i class='fa fa-exclamation-triangle' aria-hidden='true'></i>`;

const CREATE_KEY = {
    IDS: range(0, 7).map(() => 'CREATE_KEY-' + s4()),
    init: function () {


        setTimeout(() => {

            const checkInput = (id, inputId) => {
                if (s('.' + this.IDS[inputId]).value == '') {
                    htmls('.' + this.IDS[id], errorIcon + renderLang({ es: 'Campo vacio', en: 'Empty Field' }));
                    fadeIn(s('.' + this.IDS[id]));
                    return false;
                } else {
                    s('.' + this.IDS[id]).style.display = 'none';
                    return true;
                }
            };

            const errorsIdInput = [5, 6];
            const inputValueContent = [0, 7];

            const checkAllInput = (setEvent) => inputValueContent.map((inputId, i) => {
                s('.' + this.IDS[inputId]).onblur = () => checkInput(errorsIdInput[i], inputId);
                s('.' + this.IDS[inputId]).oninput = () => checkInput(errorsIdInput[i], inputId);
                if (setEvent) return;
                return s('.' + this.IDS[inputId]).oninput();
            }).filter(x => x == false).length === 0;

            checkAllInput(true);

            s('.' + this.IDS[1]).onclick = e => {
                e.preventDefault();
                console.log('onclick', s('.' + this.IDS[0]).value);
                if (!checkAllInput()) return;
                s('.' + this.IDS[2]).style.display = 'none';
                s('.' + this.IDS[4]).style.display = 'none';
                fadeIn(s('.' + this.IDS[3]));
                fetch('/keys/create-key', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ passphrase: s('.' + this.IDS[0]).value }),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        console.log('POST - /create-key', res);
                        htmls('.' + this.IDS[2], res.privateKey);
                        s('.' + this.IDS[3]).style.display = 'none';
                        fadeIn(s('.' + this.IDS[2]));
                        fadeIn(s('.' + this.IDS[4]));
                        inputValueContent.map(inputId =>
                            s('.' + this.IDS[inputId]).value = '');
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

                  <div class='in'>${renderLang({ es: 'Nombre', en: 'Name' })}</div>
                  <input class='in ${this.IDS[7]}' type='text' placeholder=' ...'>
                  <div class='in error-input ${this.IDS[6]}'></div>

                  <div class='in'>${renderLang({ es: 'Contraseña', en: 'Password' })}</div>
                  <input class='in ${this.IDS[0]}' type='password' autocomplete='new-password' placeholder=' ...'>
                  <div class='in error-input ${this.IDS[5]}'></div>

                  <button class='${this.IDS[1]}'>
                    ${renderLang({ es: 'Crear', en: 'Create' })}
                  </button>
                </form>
                <pre class='in ${this.IDS[2]}' style='display: none;'></pre>
                
                <div class='in ${this.IDS[3]}' style='text-align: center; display: none;'>${spinner}</div>
            </div>
        `
    }
};


const TABLE_KEYS = {
    IDS: range(0, 10).map(() => 'TABLE_KEYS-' + s4()),
    renderTable: function () {

    },
    init: function () {

        return /*html*/`
            <div class=' in container ${this.IDS[0]}'>
                    table keys
            </div>
        `;
    }
};


append('body', /*html*/`
        <div class='in container' style='margin-top: 20px'>
               KOYN UI v1.0.0
        </div>
        ${CREATE_KEY.init()}
        ${TABLE_KEYS.init()}

`);


