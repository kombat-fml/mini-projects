'use strict';

const startBtn = document.getElementById('start'),
  cancelBtn = document.getElementById('cancel'),
  incomeAdd = document.getElementsByTagName('button')[0],
  expensesAdd = document.getElementsByTagName('button')[1],
  depositCheck = document.querySelector('#deposit-check'),
  additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
  salaryAmount = document.querySelector('.salary-amount'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  periodSelect = document.querySelector('.period-select'),
  budgetDayValue = document.querySelector('.budget_day-value'),
  budgetMonthValue = document.querySelector('.budget_month-value'),
  additionalIncomeValue = document.querySelector('.additional_income-value'),
  additionalExpensesValue = document.querySelector('.additional_expenses-value'),
  incomePeriodValue = document.querySelector('.income_period-value'),
  targetMonthValue = document.querySelector('.target_month-value'),
  expensesMonthValue = document.querySelector('.expenses_month-value'),
  depositBank = document.querySelector('.deposit-bank'),
  depositAmount = document.querySelector('.deposit-amount'),
  depositPercent = document.querySelector('.deposit-percent');
let expensesItems = document.querySelectorAll('.expenses-items'),
  incomeItems = document.querySelectorAll('.income-items'),
  periodAmount = document.querySelector('.period-amount'),
  listenedInputsName = document.querySelectorAll('input[placeholder="Наименование"]'),
  listenedInputsSum = document.querySelectorAll('input[placeholder="Сумма"]');

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class AppData {
  constructor() {
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.resultData = new Map();
    this.targetMonth = 0;
    this.savedMoney = 0;
  }

  wipeData() {
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.targetMonth = 0;
    this.savedMoney = 0;
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  addToStorage(item) {
    const newData = {
      value: this[item],
      item: item,
      key: this.generateKey(),
    };
    this.resultData.set(newData.key, newData);
    document.cookie = encodeURIComponent(newData.item) + '=' + encodeURIComponent(newData.value);
  }
  writeToLocalStorage() {
    localStorage.setItem('calculator', JSON.stringify([...this.resultData]));
  }

  start() {
    this.budget = +salaryAmount.value;
    expensesItems = document.querySelectorAll('.expenses-items');
    incomeItems = document.querySelectorAll('.income-items');
    this.getExpInc();
    this.getAddExpInc();

    this.getIncomeMonth();
    this.getExpensesMonth();

    this.getInfoDeposit();
    this.getBudget();

    this.calcGetSavedMoney();
    this.calcGetTargetMonth();

    this.writeData();
    this.writeToLocalStorage();
    this.showResult();
    this.disableCalc();
  }
  writeData() {
    this.addToStorage('budgetMonth');
    this.addToStorage('budgetDay');
    this.addToStorage('expensesMonth');
    this.addToStorage('addExpenses');
    this.addToStorage('addIncome');
    this.addToStorage('targetMonth');
    this.addToStorage('savedMoney');
    document.cookie = 'isLoad=true';
  }
  loadData(storage) {
    const tempData = [];
    storage.forEach((elem) => tempData.push(elem[1]));
    tempData.forEach((elem) => {
      // console.log(this);
      const value = elem.item;
      switch (elem.item) {
        case 'budgetMonth':
          this.budgetMonth = elem.value;
          break;
        case 'budgetDay':
          this.budgetDay = elem.value;
          break;
        case 'expensesMonth':
          this.expensesMonth = elem.value;
          break;
        case 'addExpenses':
          this.addExpenses = elem.value;
          break;
        case 'addIncome':
          this.addIncome = elem.value;
          break;
        case 'targetMonth':
          this.targetMonth = elem.value;
          break;
        case 'savedMoney':
          this.savedMoney = elem.value;
          break;
      }
    });

    // console.log(this.resultData);

    this.showResult();
  }
  disableCalc() {
    const dataInputs = document.querySelector('.data').querySelectorAll('input[type="text"]');
    const btnPlus = document.querySelectorAll('.btn_plus');
    btnPlus[0].disabled = true;
    btnPlus[1].disabled = true;
    dataInputs.forEach(function (item) {
      item.disabled = true;
    });
    startBtn.style.display = 'none';
    cancelBtn.style.display = 'Block';
    depositBank.disabled = true;
    depositAmount.disabled = true;
    depositPercent.disabled = true;
    depositCheck.disabled = true;
    periodSelect.disabled = true;
  }

  removeInputs() {
    incomeItems = document.querySelectorAll('.income-items');
    if (incomeItems.length > 1) {
      for (let i = incomeItems.length - 1; i > 0; i--) {
        incomeItems[i].remove();
      }
    }
    incomeItems[0].children[0].value = '';
    incomeItems[0].children[1].value = '';

    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length > 1) {
      for (let i = expensesItems.length - 1; i > 0; i--) {
        expensesItems[i].remove();
      }
    }
    expensesItems[0].children[0].value = '';
    expensesItems[0].children[1].value = '';
  }
  reset() {
    this.removeInputs();
    const allInputs = document.querySelectorAll('input');
    const btnPlus = document.querySelectorAll('.btn_plus');
    btnPlus[0].disabled = false;
    btnPlus[1].disabled = false;
    allInputs.forEach(function (item) {
      item.value = '';
      item.disabled = false;
    });
    expensesAdd.style.display = 'Block';
    incomeAdd.style.display = 'Block';
    periodSelect.value = '1';
    periodAmount.textContent = periodSelect.value;
    cancelBtn.style.display = 'none';
    startBtn.style.display = 'Block';
    startBtn.disabled = true;

    depositBank.disabled = false;
    depositAmount.disabled = false;
    depositPercent.disabled = false;
    depositCheck.disabled = false;
    depositCheck.checked = false;
    periodSelect.disabled = false;

    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    depositBank.value = '';
    depositAmount.value = '';
    depositPercent.value = '';
    this.resultData.clear();
    this.wipeData();
    this.cleanCookie();
    this.cleanStorage();
  }
  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.targetMonth;
    incomePeriodValue.value = this.savedMoney;
  }
  calcGetSavedMoney() {
    this.savedMoney = this.calcSavedMoney();
  }
  calcGetTargetMonth() {
    this.targetMonth = this.getTargetMonth();
  }

  addExpInc(items, block) {
    let cloneItem = items[0].cloneNode(true);
    const str = cloneItem.className.split('-')[0];
    cloneItem.children[0].value = '';
    cloneItem.children[0].addEventListener('input', this.replaceDigit);
    cloneItem.children[1].value = '';
    cloneItem.children[1].addEventListener('input', this.replaceLetter);
    items[0].parentNode.insertBefore(cloneItem, block);
    items = document.querySelectorAll(`.${str}-items`);

    if (items.length === 3) {
      block.style.display = 'none';
    }
  }
  getExpInc() {
    const count = (item) => {
      const str = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${str}-title`).value.trim();
      const itemAmoun = item.querySelector(`.${str}-amount`).value.trim();
      if (!isNumber(itemTitle) && itemTitle !== '' && isNumber(itemAmoun) && itemAmoun !== '') {
        this[str][itemTitle] = +itemAmoun;
      }
    };

    incomeItems.forEach(count);
    expensesItems.forEach(count);
  }
  getAddExpInc() {
    let addExpenses = additionalExpensesItem.value.toLowerCase().split(',');
    let addIncome = [];
    const count = (item, str) => {
      if (item !== '' && !isNumber(item)) {
        this[str].push(item[0].toUpperCase() + item.slice(1));
      }
    };

    addExpenses.forEach((item) => count(item.trim(), 'addExpenses'));
    additionalIncomeItems.forEach((item) => {
      addIncome.push(item.value.trim());
    });
    addIncome.forEach((item) => count(item, 'addIncome'));
  }

  getExpensesMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }
  getIncomeMonth() {
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }
  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }
  getTargetMonth() {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }
  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }
  changePercent() {
    if (!isNumber(depositPercent.value) || depositPercent.value < 0 || depositPercent.value >= 100) {
      alert('Введите корректное значение в поле проценты!');
    }
  }
  changeBank() {
    const selectValue = this.value;
    if (selectValue === 'other') {
      depositPercent.style.display = 'inline-block';
    } else {
      depositPercent.value = selectValue;
      depositPercent.style.display = 'none';
    }
  }
  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      depositPercent.value = '';
      this.deposit = false;
    }
    this.enablingStart();
  }
  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }
  addingEventListeners() {
    listenedInputsName.forEach((item) => {
      item.addEventListener('input', this.replaceDigit);
    });
    listenedInputsSum.forEach((item) => {
      item.addEventListener('input', this.replaceLetter);
    });
    expensesAdd.addEventListener('click', () => {
      this.addExpInc(expensesItems, expensesAdd);
    });
    incomeAdd.addEventListener('click', () => {
      this.addExpInc(incomeItems, incomeAdd);
    });

    startBtn.addEventListener('click', this.start.bind(this));
    cancelBtn.addEventListener('click', this.reset.bind(this));
    this.enablingStart();
    salaryAmount.addEventListener('input', this.enablingStart);
    depositPercent.addEventListener('input', this.changePercent);
    depositBank.addEventListener('change', this.changeBank);
    depositPercent.addEventListener('input', this.enablingStart);
    depositBank.addEventListener('change', this.enablingStart);

    periodSelect.value = '1';
    periodAmount.textContent = periodSelect.value;
    periodSelect.addEventListener('input', () => {
      periodAmount.textContent = periodSelect.value;
      incomePeriodValue.value = this.calcSavedMoney();
    });

    depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
  enablingStart() {
    if (
      isNumber(salaryAmount.value) &&
      salaryAmount.value !== '' &&
      salaryAmount.value !== null &&
      (!depositCheck.checked ||
        (depositCheck.checked &&
          depositBank.value !== '' &&
          isNumber(depositPercent.value) &&
          depositPercent.value >= 0 &&
          depositPercent.value < 100))
    ) {
      startBtn.disabled = false;
    } else {
      startBtn.disabled = true;
    }
  }
  replaceDigit() {
    this.value = this.value.replace(/[^а-яА-ЯёЁ ,.?!]/, '');
  }
  replaceLetter() {
    this.value = this.value.replace(/\D/, '');
  }
  startProgram() {
    const cookieArr = document.cookie.split('; ');
    const allCookie = [];
    cookieArr.forEach((item) => allCookie.push(item.split('=')));
    if (allCookie.some((elem) => elem[0] === 'isLoad' && elem[1] === 'true')) {
      const storage = JSON.parse(localStorage.getItem('calculator'));
      if (this.findIdent(allCookie, storage)) {
        this.disableCalc();
        this.loadData(storage);
        this.addingEventListeners();
      } else {
        this.reset();
      }
    } else {
      this.addingEventListeners();
    }
  }
  findIdent(cookie, storage) {
    return storage.every((storageEl) => {
      return cookie.some((cookieEl) => {
        return storageEl[1].item === cookieEl[0];
      });
    });
  }
  cleanCookie() {
    function setCookie(name, value, options = {}) {
      options = {
        path: '/',
        // при необходимости добавьте другие значения по умолчанию
        ...options,
      };

      if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
      }

      let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

      for (let optionKey in options) {
        updatedCookie += '; ' + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += '=' + optionValue;
        }
      }
      document.cookie = updatedCookie;
    }
    const cookieArr = document.cookie.split('; ');
    const allCookie = [];
    cookieArr.forEach((item) => allCookie.push(item.split('=')));
    allCookie.forEach((item) => {
      setCookie(item[0], '', {
        'max-age': -1,
      });
    });
  }
  cleanStorage() {
    localStorage.clear();
  }
}

const appData = new AppData();
appData.startProgram();
// appData.addingEventListeners();
