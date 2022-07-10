

const s = _el => document.querySelector(_el);
const htmls = (_el, _html) => s(_el).innerHTML = _html;
const append = (_el, _html) => s(_el).insertAdjacentHTML('beforeend', _html);
const s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
const range = (start, end) => {
    return Array.apply(0, Array(end - start + 1))
        .map((element, index) => index + start);
};



const CREATE_KEY = {
    init: () => {

        const IDS = range(0, 3).map(() => 'CREATE_KEY-' + s4());

        setTimeout(() => {
            s('.' + IDS[1]).onclick = e => {
                e.preventDefault();
                console.log('onclick', s('.' + IDS[0]).value);

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
                        htmls('.' + IDS[3], res.privateKey);
                        s('.' + IDS[2]).style.display = 'block';
                    });

            };
        });
        return /*html*/`
            <div class='in container' style='margin-top: 20px'>
                KOYN UI v1.0.0
            </div>
            <div class='in container'>
                <form class='in'>
                  ${{ es: 'Contraseña llave publica', en: 'Public Key password' }[s('html').lang]}
                  <input class='${IDS[0]}' type='password' autocomplete='new-password' placeholder=' ...'>
                  <button class='${IDS[1]}'>${{ es: 'Crear llaves', en: 'Create keys' }[s('html').lang]}</button>
                </form>
                <div class='in ${IDS[2]}' style='font-size: 12px; display: none; overflow: auto'>
                    <pre class='${IDS[3]}'></pre>
                </div>
            </div>
        `
    }
};


append('body', CREATE_KEY.init());


