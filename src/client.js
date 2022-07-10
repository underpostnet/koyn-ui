

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
    const fade =  () =>  {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    };
    fade();
};

const spinner = /*html*/`
             <div class='inl'>
                  <div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
             </div>
`;

const CREATE_KEY = {
    init: () => {

        const IDS = range(0, 4).map(() => 'CREATE_KEY-' + s4());

        setTimeout(() => {
            s('.' + IDS[1]).onclick = e => {
                e.preventDefault();
                console.log('onclick', s('.' + IDS[0]).value);
                s('.' + IDS[2]).style.display = 'none';
                s('.' + IDS[4]).style.display = 'none';
                fadeIn(s('.' + IDS[3]));
                fetch('/create-key', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ passphrase: s('.' + IDS[0]).value }),
                })
                    .then((res) => res.json())
                    .then((res) => {
                        console.log('POST - /create-key', res);
                        htmls('.' + IDS[2], res.privateKey);
                        s('.' + IDS[3]).style.display = 'none';
                        fadeIn(s('.' + IDS[2]));
                        fadeIn(s('.' + IDS[4]));
                    });

            };
        });
        return /*html*/`
            <div class='in container' style='margin-top: 20px'>
                KOYN UI v1.0.0
            </div>
            <div class='in container'>
                <form class='in ${IDS[4]}'>
                  ${{ es: 'Contraseña llave publica', en: 'Public Key password' }[s('html').lang]}
                  <input class='${IDS[0]}' type='password' autocomplete='new-password' placeholder=' ...'>
                  <button class='${IDS[1]}'><i class='fa fa-key' aria-hidden='true'></i>${{ es: 'Crear llaves', en: 'Create keys' }[s('html').lang]}</button>
                </form>
                <pre class='in ${IDS[2]}' style='display: none;'></pre>
                
                <div class='in ${IDS[3]}' style='text-align: center; display: none;'>${spinner}</div>
            </div>
        `
    }
};


append('body', CREATE_KEY.init());


