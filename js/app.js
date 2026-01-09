// --- SELECTORES ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const countSpan = document.getElementById('count');
const filterOption = document.querySelector('.filter-todo');

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', getTodos); // Cargar tareas guardadas
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', manageTask);
filterOption.addEventListener('change', filterTodo);

// --- FUNCIONES PRINCIPALES ---

// 1. Agregar Tarea
function addTask(e) {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    // Validación
    if (taskText === '') {
        errorMsg.classList.remove('hidden');
        todoInput.focus();
        return;
    } else {
        errorMsg.classList.add('hidden');
    }

    // Crear visualmente
    createTaskElement(taskText, false);
    // Guardar en memoria
    saveLocalTodos(taskText, false);

    todoInput.value = '';
    updateCount();
}

// 2. Gestionar Tarea (Borrar o Completar)
function manageTask(e) {
    const item = e.target;
    // Buscamos el elemento padre (li) independientemente de dónde se hizo click
    const todoElement = item.closest('.todo-item'); 
    
    if (!todoElement) return;

    // A. Eliminar tarea
    if (item.classList.contains('btn-delete')) {
        
        // CONFIRMACIÓN DE SEGURIDAD
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
        
        if (confirmDelete) {
            todoElement.classList.add('fall'); // Animación CSS
            removeLocalTodos(todoElement); // Borrar de memoria

            // Esperar a que termine la animación para borrar del HTML
            todoElement.addEventListener('transitionend', function() {
                todoElement.remove();
                updateCount();
                // Importante: Actualizar filtro por si cambia el conteo visual
                const event = { target: filterOption };
                filterTodo(event); 
            });
        }
    }

    // B. Marcar como completada
    if (item.classList.contains('btn-check') || item.tagName === 'SPAN') {
        todoElement.classList.toggle('completed');
        updateLocalTodoState(todoElement);
        updateCount();
        
        // Refrescar el filtro inmediatamente para que desaparezca si estamos en "Pendientes"
        const event = { target: filterOption };
        filterTodo(event); 
    }
}

// 3. Filtros
function filterTodo(e) {
    const todos = todoList.childNodes;
    // Si la función se llama desde un evento, usa el target, si no, usa el valor directo del select
    const filterValue = e.target ? e.target.value : filterOption.value;

    todos.forEach(function(todo) {
        if (todo.nodeType === 1) { // Asegurar que es un elemento HTML
            switch (filterValue) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if (todo.classList.contains('completed')) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
                case "uncompleted":
                    if (!todo.classList.contains('completed')) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    break;
            }
        }
    });
}

// 4. Crear HTML de la tarea
function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (isCompleted) li.classList.add('completed');

    // Botón Check
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '✓';
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    // Texto
    const span = document.createElement('span');
    span.innerText = text;
    li.appendChild(span);

    // Botón Borrar
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕';
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    // Insertar al inicio de la lista
    todoList.insertBefore(li, todoList.firstChild); 
}

// 5. Actualizar contador de pendientes
function updateCount() {
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    countSpan.innerText = pendingTasks;
}

// --- LOCAL STORAGE (Persistencia) ---

function checkLocalStorage() {
    if (localStorage.getItem('todos') === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem('todos'));
    }
}

function saveLocalTodos(todoText, isCompleted) {
    let todos = checkLocalStorage();
    todos.push({ text: todoText, completed: isCompleted });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = checkLocalStorage();
    // Invertimos para mostrar en orden correcto al usar insertBefore
    todos.slice().reverse().forEach(function(todoObj) {
        createTaskElement(todoObj.text, todoObj.completed);
    });
    updateCount();
}

function removeLocalTodos(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    // Filtramos para quitar la tarea que coincida con el texto
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

function updateLocalTodoState(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    const isCompleted = todoElement.classList.contains('completed');
    
    // Buscamos y actualizamos el estado
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex > -1) {
        todos[todoIndex].completed = isCompleted;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}