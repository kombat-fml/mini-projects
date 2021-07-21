'use strict';

class ToDo {
  constructor(form, input, todoList, todoCompleted) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    this.todoContainer = document.querySelector('.todo-container');
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todo.key;
    li.insertAdjacentHTML(
      'beforeend',
      `
      <span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `
    );

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(event) {
    event.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.todoData.set(newTodo.key, newTodo);
      this.input.value = '';
      this.render();
    } else {
      alert('Пустое поле добавить нельзя!');
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  expand(element) {
    let times = 5;
    requestAnimationFrame(function step() {
      element.style.width = `${times}%`;
      times += 2;
      if (times > 40) element.children[1].style.display = 'block';
      if (times <= 100) {
        requestAnimationFrame(step);
      } else {
        element.style.width = '100%';
      }
    });
  }

  collapse(element) {
    let times = 100;
    const _this = this;
    requestAnimationFrame(function step() {
      element.style.width = `${times}%`;
      times -= 2;
      if (times < 40) element.children[1].style.display = 'none';
      if (times > 5) {
        requestAnimationFrame(step);
      } else {
        element.remove();
        if (_this.todoData.get(element.key).completed) {
          _this.todoCompleted.append(element);
        } else {
          _this.todoList.append(element);
        }
        _this.expand(element);
      }
    });
  }

  animateSwitchItem(element) {
    element.style.float = 'right';
    this.collapse(element);
  }

  animateDeleteItem(element) {
    let times = 100;
    // const _this = this;
    requestAnimationFrame(function step() {
      element.style.opacity = times / 100;
      times -= 3;
      if (times > 0) {
        requestAnimationFrame(step);
      } else {
        element.remove();
      }
    });
  }

  deleteItem(element) {
    const obj = this.todoData.get(element.closest('li').key);
    this.todoData.delete(obj.key);
    this.addToStorage();
    // this.render();
    this.animateDeleteItem(element.closest('li'));
  }

  completedItem(element) {
    const obj = this.todoData.get(element.closest('li').key);
    const newObj = {
      value: obj.value,
      completed: !obj.completed,
      key: obj.key,
    };
    this.todoData.delete(newObj.key);
    this.todoData.set(newObj.key, newObj);
    this.addToStorage();
    this.animateSwitchItem(element.closest('li'));
  }

  changeItem(span) {
    const target = span.target;
    const obj = this.todoData.get(target.closest('li').key);
    target.contentEditable = 'false';
    const newObj = {
      value: target.textContent,
      completed: obj.completed,
      key: obj.key,
    };
    this.todoData.set(newObj.key, newObj);
    this.addToStorage();
  }

  editItem(element) {
    const span = element.closest('li').children[0];
    span.contentEditable = 'true';
    span.focus();
    span.onblur = this.changeItem.bind(this);
  }

  handler(event) {
    const target = event.target;
    if (target.classList.contains('todo-complete')) this.completedItem(target);
    if (target.classList.contains('todo-remove')) this.deleteItem(target);
    if (target.classList.contains('todo-edit')) this.editItem(target);
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.todoContainer.addEventListener('click', this.handler.bind(this));
    this.render();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
