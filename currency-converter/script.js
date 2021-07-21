document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const select = document.getElementById('select'),
        inputFrom = document.getElementById('input-from'),
        spanFrom = document.getElementById('from'),
        inputTo = document.getElementById('input-to'),
        spanTo = document.getElementById('to'),
        button = document.getElementById('start'),
        textMoney = {
            usd: 'Доллар США (USD)',
            eur: 'Евро (EUR)',
            rub: 'Российский Рубль (RUB)'
        };
    let currentFrom = select.value.substr(0, 3).toUpperCase(),
        currentTo = select.value.substr(-3, 3).toUpperCase();

    const converting = (data) => {
        const {
            USD,
            RUB
        } = data.rates,
            value = +inputFrom.value;
        let sum = 0;
        if (currentFrom === 'EUR') {
            sum = parseFloat(value * RUB).toFixed(2);
        } else if (currentFrom === 'USD') {
            sum = parseFloat(value * RUB / USD).toFixed(2);
        } else if (currentTo === 'EUR') {
            sum = parseFloat(value / RUB).toFixed(2);
        } else {
            sum = parseFloat(value * USD / RUB).toFixed(2);
        }
        inputTo.value = sum;
    }

    const request = (url) => {
        fetch(url, {
                method: 'GET',
                mode: 'cors',
                body: JSON.stringify()
            })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('status network not 200!')
                }
                return response.json()
            })
            .then((data) => {
                converting(data);
            })
            .catch(error => console.error(error))
    };

    const replaceLetter = function () {
        this.value = this.value.replace(/^[0\.]|[^\d\.]/, '');
        this.value ? button.disabled = false : button.disabled = true
    }

    inputFrom.addEventListener('input', replaceLetter)

    select.addEventListener('change', function () {
        const from = this.value.substr(0, 3),
            to = this.value.substr(-3, 3);
        currentFrom = from.toUpperCase();
        currentTo = to.toUpperCase();
        spanFrom.textContent = textMoney[from];
        spanTo.textContent = textMoney[to];
    })

    button.addEventListener('click', () => {
        const url = `http://api.exchangeratesapi.io/v1/latest?access_key=67a86c16274632adb37cd940a46197d5&symbols=USD,RUB`;
        request(url);
    })

});