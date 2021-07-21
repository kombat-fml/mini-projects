'use strict';

const todoControl = document.querySelector('.todo-control'),
  headerInput = document.querySelector('.header-input'),
  todoList = document.querySelector('.todo-list'),
  todoCompleted = document.querySelector('.todo-completed');

let todoData;

const readFromLocalStorage = function () {
  let json = localStorage.getItem('ToDo');
  json = JSON.parse(json);
  return json ? json : [];
};

const writeToLocalStorage = function (data) {
  const json = JSON.stringify(data);
  localStorage.setItem('ToDo', json);
};

const render = function () {
  todoList.textContent = '';
  todoCompleted.textContent = '';
  todoData.forEach(function (item, i) {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML =
      '<span class="text-todo">' +
      item.value +
      '</span>' +
      '<div class="todo-buttons">' +
      '<button class="todo-remove"></button>' +
      '<button class="todo-complete"></button>' +
      '</div>';

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }
    const todoComplete = li.querySelector('.todo-complete');
    todoComplete.addEventListener('click', function () {
      item.completed = !item.completed;
      render();
    });
    const todoRemove = li.querySelector('.todo-remove');
    todoRemove.addEventListener('click', function () {
      li.remove();
      todoData.splice(i, 1);
      render();
    });
  });
  writeToLocalStorage(todoData);
};

todoControl.addEventListener('submit', function (event) {
  event.preventDefault();
  if (headerInput.value.trim()) {
    const newTodo = {
      value: headerInput.value,
      completed: false,
    };

    todoData.push(newTodo);
    headerInput.value = '';
    render();
  }
});

todoData = readFromLocalStorage();
render();
