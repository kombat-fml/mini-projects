'use strict';

const input = document.getElementById('select-cities'),
  dropdownLists = document.querySelector('.dropdown-lists'),
  listDefault = document.querySelector('.dropdown-lists__list--default'),
  listDefaultCol = listDefault.querySelector('.dropdown-lists__col'),
  listSelect = document.querySelector('.dropdown-lists__list--select'),
  listSelectCol = listSelect.querySelector('.dropdown-lists__col'),
  listAutocomplete = document.querySelector('.dropdown-lists__list--autocomplete'),
  listAutocompleteCol = listAutocomplete.querySelector('.dropdown-lists__col'),
  button = document.querySelector('.button'),
  closeButton = document.querySelector('.close-button'),
  loading = document.querySelector('.loading'),
  countries = [],
  cities = [];

const renderList = (country, list = 'none') => {
  const currentCountry = countries.find(item => item.country === country),
    countData = list === 'default' ? 3 : currentCountry.cities.length,
    currentList = list === 'default' ? listDefaultCol : listSelectCol,
    block = document.createElement('div');

  block.dataset.country = country;
  block.className = 'dropdown-lists__countryBlock';
  block.innerHTML = `
    <div class="dropdown-lists__total-line">
      <div class="dropdown-lists__country">${country}</div>
      <div class="dropdown-lists__count">${currentCountry.count}</div>
    </div>
  `;

  for (let i = 0; i < countData; i++) {
    const city = currentCountry.cities[i];
    block.innerHTML += `
      <div class="dropdown-lists__line">
        <div class="dropdown-lists__city" data-link="${city.link}">${city.name}</div>
        <div class="dropdown-lists__count">${city.count}</div>
      </div>
    `;
  }
  currentList.appendChild(block);
};

const renderAutocompleteList = (cities) => {
  const block = document.createElement('div');
  block.className = 'dropdown-lists__countryBlock';

  if (cities.length > 0) {
    cities.forEach((item) => {
      block.innerHTML += `
        <div class="dropdown-lists__line">
          <div class="dropdown-lists__city" data-link="${item.link}">${item.name}</div>
          <div class="dropdown-lists__count">${item.count}</div>
        </div>
      `;
    });
  } else {
    block.textContent = 'Ничего не найдено';
  }

  listAutocomplete.appendChild(block);
};

const getData = (data, lang) => {
  data[lang].forEach((item) => {
    countries.push({country: item.country, count: +item.count, cities: item.cities.sort((a, b) => b.count - a.count)});
    cities.push(...item.cities);
  });
};

const request = async (lang) => {
  let res = await fetch('db_cities.json')
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('status network not 200!');
      }
      return response.json();
    })
    .then((result) => getData(result, lang))
    .catch((error) => console.error('Ошибка запроса: ', error));
};

const showEl = (el) => {
  el.classList.add('active');
};

const hideEl = (el) => {
  el.classList.remove('active');
};
const animateList = (start, end, direction) => {
  const step = direction === 'left' ? -1 : 1;
  let counter = start;
  requestAnimationFrame(function animate() {
    counter += step;
    dropdownLists.style.transform = `translateX(${counter}%)`;
    if (counter !== end) requestAnimationFrame(animate);
  });
};

const clickToDropdown = (event) => {
  const target = event.target,
    country = target.closest('.dropdown-lists__countryBlock').dataset.country;
  if (target.closest('.dropdown-lists__total-line')) {
    applyInputValue(target.closest('.dropdown-lists__total-line').children[0]);
    if (target.closest('.dropdown-lists__list--default')) {
      listSelectCol.textContent = '';
      renderList(country);
      animateList(0, -100, 'left');
    } else {
      animateList(-100, 0, 'right');
    }
  } else if (target.closest('.dropdown-lists__line')) {
    const cityEl = target.closest('.dropdown-lists__line').children[0];
    applyInputValue(cityEl);
    button.href = cityEl.dataset.link;
    showEl(button);
  }
};

const closeButtonHandler = () => {
  input.value = '';
  showEl(listDefault);
  showEl(listSelect);
  hideEl(dropdownLists);
  dropdownLists.style.transform = '';
  hideEl(listAutocomplete);
  hideEl(closeButton);
  hideEl(button);
};

const applyInputValue = (elem) => {
  input.value = elem.textContent;
  showEl(closeButton);
};

const changeInput = function () {
  const value = this.value.trim();
  if (value !== '') {
    const reg = new RegExp(`^${value}`, 'i');
    const suitableCities = cities.filter((item) => reg.test(item.name));
    listAutocomplete.textContent = '';
    renderAutocompleteList(suitableCities);
    hideEl(listSelect);
    hideEl(listDefault);
    showEl(listAutocomplete);
    showEl(closeButton);
    dropdownLists.style.transform = '';
  } else {
    showEl(listSelect);
    hideEl(closeButton);
    hideEl(listAutocomplete);
    showEl(listDefault);
    hideEl(button);
    dropdownLists.style.transform = '';
  }
};

const addListeners = () => {
  input.addEventListener('focus', () => {
    showEl(dropdownLists);
    showEl(listDefault);
  });

  document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.input-cities')) {
      hideEl(dropdownLists);
      hideEl(listDefault);
    }
  })

  dropdownLists.addEventListener('click', clickToDropdown);

  input.addEventListener('input', changeInput);

  closeButton.addEventListener('click', closeButtonHandler);
};

const getLocale = () => {
  let locale;
    do {
        locale = prompt('Введите локализацию: RU, EN или DE').trim();
    } while (!locale || (locale !== 'RU' && locale !== 'EN' && locale !== 'DE'));

    document.cookie = `locale=${locale}`;
    return locale;
}

const setLocalStorage = () => {
  localStorage.setItem('countries', JSON.stringify(countries));
  localStorage.setItem('cities', JSON.stringify(cities));
}


const clearLocalStorage = () => {
  localStorage.clear();
}

const getLocalStorage = () => {
  JSON.parse(localStorage.getItem('countries')).forEach(item => {
    countries.push({country: item.country, count: +item.count, cities: item.cities.sort((a, b) => b.count - a.count)})
  });
  cities.push(...JSON.parse(localStorage.getItem('cities')));
}

const sortAndRender = (lang) => {

  countries.sort((a, b) => {
    switch (`${lang}-${a.country}`) {
      case 'RU-Россия':
      case 'EN-United Kingdom':
      case 'DE-Deutschland':
        return -1;
      default:
        return 1;
    }
  })

  countries.forEach(item => {
    renderList(item.country, 'default');
  })
}

const start = async () => {
  let lang = document.cookie.slice(-2);
  if (!lang) {
    lang = getLocale();
    await request(lang);
    clearLocalStorage();
    setLocalStorage();
  } else {
    getLocalStorage();
  }
  sortAndRender(lang);

  hideEl(loading);
  addListeners();


}

start();
