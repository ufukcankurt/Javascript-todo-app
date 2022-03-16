const todosListDOM = document.querySelector("#todos");
const endTodosListDOM = document.querySelector("#end-todos");
let _todos = [];
let _endtodos = [];
window.addEventListener("load", () => {
  const formDOM = document.querySelector("#new-todo-form");
  const newTodoDOM = document.querySelector("#new-todo-input");

  load();

  formDOM.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTodoValue = newTodoDOM.value;

    if (!newTodoValue) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please add new task!',
      })
      return;
    }

    createContent(newTodoValue);
    newTodoDOM.value = "";
  });
});

function load() {
  _todos = getLocalStorage("todos");
  if (Array.isArray(_todos)) {
    _todos.forEach((value, key) => {
      createContent(value["value"], value["id"]);
    });
  } else {
    _todos = [];
  }

  _endtodos = getLocalStorage("end_todos");
  if (Array.isArray(_endtodos)) {
    _endtodos.forEach((value, key) => {
      createContent(value["value"], value["id"], firstLoad = "true");
    });
  } else {
    _endtodos = [];
  }
}

// todo:: add item to todo list
function addTodo(item) {
  todosListDOM.appendChild(item);
}

//todo:: add  item end todo  list
function addEndTodo(item) {
  endTodosListDOM.appendChild(item);
}

// todo:: remove  item to todo list
function removeTodo(item, uuid) {
  todosListDOM.removeChild(item);
  _todos.forEach((value, key) => {
      if (value['id'] === uuid) {
          _todos.splice(key, 1);
      }
  })
  setLocalStorage("todos", _todos);
}

//todo:: remove item to  end todo list
function removeEndTodo(item, uuid) {
  endTodosListDOM.removeChild(item);
  _endtodos.forEach((value, key) => {
      if (value['id'] === uuid) {
          _endtodos.splice(key, 1);
      }
  })
  setLocalStorage("end_todos", _endtodos);
}

// todo:: create frontend content and add event listener for button
function createContent(newTodoValue, uuid = null, firstLoad = null) {
  const newTodoItem = document.createElement("div");
  newTodoItem.classList.add("todo");

  const newTodoItemContent = document.createElement("div");
  newTodoItemContent.classList.add("content");

  newTodoItem.appendChild(newTodoItemContent);

  const newTodoItemInput = document.createElement("input");
  newTodoItemInput.classList.add("text");
  newTodoItemInput.type = "text";
  newTodoItemInput.value = newTodoValue;
  newTodoItemInput.setAttribute("readonly", "readonly");

  newTodoItemContent.appendChild(newTodoItemInput);
  const newTodoAction = document.createElement("div");
  newTodoAction.classList.add("actions");

  const newTodoEdit = document.createElement("button");
  newTodoEdit.classList.add("edit");
  newTodoEdit.innerHTML = "Edit";

  const newTodoDelete = document.createElement("button");
  newTodoDelete.classList.add("delete");
  newTodoDelete.innerHTML = "Delete";

  const newTodoChange = document.createElement("div");
  

  const newTodoChangeIcon = document.createElement("i");
  

  if(firstLoad == "true"){
    newTodoChange.classList.add("finish-unfinish", "finishicon-color");
    newTodoChangeIcon.classList.add("fa", "fa-question");
  }else{
    newTodoChange.classList.add("finish-unfinish", "unfinishicon-color");
    newTodoChangeIcon.classList.add("fa", "fa-check");
  }


  newTodoChange.appendChild(newTodoChangeIcon);

  newTodoAction.appendChild(newTodoEdit);
  newTodoAction.appendChild(newTodoDelete);
  newTodoItem.prepend(newTodoChange);

  newTodoItem.appendChild(newTodoAction);
  

  if(firstLoad == "true"){
    endTodosListDOM.appendChild(newTodoItem);
  }else{
    todosListDOM.appendChild(newTodoItem);
  }

  if (uuid == null) {
    uuid = uuidv4();
    _todos.push({ id: uuid, value: newTodoValue });
    setLocalStorage("todos", _todos);
  }

  newTodoEdit.addEventListener("click", () => {
    if (newTodoEdit.innerHTML.toLowerCase() == "edit") {
      newTodoItemInput.removeAttribute("readonly");
      newTodoItemInput.focus();
      newTodoEdit.innerHTML = "SAVE";
    } else {
      newTodoItemInput.setAttribute("readonly", "readonly");
      newTodoEdit.innerHTML = "EDIT";

      // inputun sahip olduğu task-list'e göre değiştirme yapacağız.  [todos || end-todos]
      if (
        newTodoItemInput.parentElement.parentElement.parentElement.id == "todos"
      ) {
        _todos.forEach((value, key) => {
          if (value["id"] === uuid) {
            value.value = newTodoItemInput.value;
          }
        });
        setLocalStorage("todos", _todos);
      } else {
        _endtodos.forEach((value, key) => {
          if (value["id"] === uuid) {
            value.value = newTodoItemInput.value;
          }
        });
        setLocalStorage("end_todos", _endtodos);
      }
    }
  });

  newTodoDelete.addEventListener("click", () => {

    if (newTodoItem.parentElement.id == "todos") {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          removeTodo(newTodoItem, uuid);
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          )
        }
      })
      
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          removeEndTodo(newTodoItem, uuid);
          Swal.fire(
            'Deleted!',
            'Your task has been deleted.',
            'success'
          )
        }
      })
      
    }
  });

  newTodoChange.addEventListener("click", () => {

    if (newTodoItem.parentElement.id == "todos") {
      removeTodo(newTodoItem);
      addEndTodo(newTodoItem);

      _todos.forEach((value, key) => {
        if (value["id"] === uuid) {
          _endtodos.push({ id: value["id"], value: value["value"] });
          _todos.splice(key, 1);
        }
      });
      setLocalStorage("todos", _todos);
      setLocalStorage("end_todos", _endtodos);

      newTodoChangeIcon.classList.remove("fa-check");
      newTodoChangeIcon.classList.add("fa-question");
      newTodoChange.classList.remove("unfinishicon-color");
      newTodoChange.classList.add("finishicon-color");
      newTodoChange.style.left = "3%";
    } else {
      removeEndTodo(newTodoItem);
      addTodo(newTodoItem);

      _endtodos.forEach((value, key) => {
        if (value["id"] === uuid) {
          _todos.push({ id: value["id"], value: value["value"] });
          _endtodos.splice(key, 1);
        }
      });

      setLocalStorage("todos", _todos);
      setLocalStorage("end_todos", _endtodos);
      newTodoChangeIcon.classList.remove("fa-question");
      newTodoChangeIcon.classList.add("fa-check");
      newTodoChange.classList.remove("finishicon-color");
      newTodoChange.classList.add("unfinishicon-color");
      newTodoChange.style.left = "2%";
    }
  });
}

function setLocalStorage(name, data) {
  window.localStorage.setItem(name, JSON.stringify(data));
}

function getLocalStorage(name) {
  const data = window.localStorage.getItem(name);
  if (data) {
    return JSON.parse(data);
  }
  return;
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
