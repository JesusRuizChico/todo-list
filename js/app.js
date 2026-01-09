// --- VARIABLES Y SELECTORES ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMsg = document.getElementById('error-msg');
const countSpan = document.getElementById('count');

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', getTodos);
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', manageTask);

// --- FUNCIONES ---

function addTask(e) {
    e.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText === '') {
        errorMsg.classList.remove('hidden');
        todoInput.focus(); // Devolver el foco al input
        return;
    } else {
        errorMsg.classList.add('hidden');
    }

    // Crear estructura HTML (estado pendiente: false)
    createTaskElement(taskText, false);
    saveLocalTodos(taskText, false); // Guardamos estado inicial

    todoInput.value = '';
    updateCount();
}

function manageTask(e) {
    const item = e.target;
    // Asegurarnos de seleccionar el elemento LI padre correctamente
    // (Usamos closest por si se da click en un icono dentro del botón)
    const todoElement = item.closest('.todo-item'); 
    
    if (!todoElement) return; // Si el click no fue dentro de un item, salir.

    // A. Eliminar tarea (Si el click fue en el botón de borrar)
    if (item.classList.contains('btn-delete')) {
        
        // Añadimos la clase que activa la animación de salida en CSS
        todoElement.classList.add('fall'); 
        
        removeLocalTodos(todoElement);

        // ESPERAMOS a que termine la animación CSS para remover del DOM
        todoElement.addEventListener('transitionend', function() {
            todoElement.remove();
            updateCount();
        });
        // Fallback por si transitionend falla en algun navegador raro
        setTimeout(() => {
             if(document.body.contains(todoElement)) {
                 todoElement.remove();
                 updateCount();
             }
        }, 600);
    }

    // B. Marcar como completada (Si click en botón check o en el texto)
    if (item.classList.contains('btn-check') || item.tagName === 'SPAN') {
        todoElement.classList.toggle('completed');
        // Actualizamos el estado en LocalStorage
        updateLocalTodoState(todoElement);
        updateCount();
    }
}

function createTaskElement(text, isCompleted) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (isCompleted) li.classList.add('completed');

    // Usamos iconos unicode más bonitos
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '✓'; // Checkmark simple
    checkBtn.classList.add('btn-check');
    li.appendChild(checkBtn);

    const span = document.createElement('span');
    span.innerText = text;
    li.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '✕'; // Multiplicación (X más estética)
    deleteBtn.classList.add('btn-delete');
    li.appendChild(deleteBtn);

    // Insertar al principio de la lista para que las nuevas salgan arriba
    todoList.insertBefore(li, todoList.firstChild); 
}

function updateCount() {
    // Contamos solo las que NO tienen la clase .completed
    const pendingTasks = document.querySelectorAll('.todo-item:not(.completed)').length;
    countSpan.innerText = pendingTasks;
}

// --- LOCAL STORAGE MEJORADO (Guarda estado completo/pendiente) ---

function saveLocalTodos(todoText, isCompleted) {
    let todos = checkLocalStorage();
    // Guardamos un objeto en lugar de solo texto
    todos.push({ text: todoText, completed: isCompleted });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    let todos = checkLocalStorage();
    // Invertimos el array para que al cargar se muestren en orden correcto al usar insertBefore
    todos.slice().reverse().forEach(function(todoObj) {
        createTaskElement(todoObj.text, todoObj.completed);
    });
    updateCount();
}

function removeLocalTodos(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    
    // Filtramos el array para quitar el que coincida con el texto
    // (Nota: esto borrará duplicados si tienen el mismo texto exacto, para un MVP está bien)
    const updatedTodos = todos.filter(todo => todo.text !== todoText);
    
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

// Nueva función para actualizar solo el estado
function updateLocalTodoState(todoElement) {
    let todos = checkLocalStorage();
    const todoText = todoElement.querySelector('span').innerText;
    const isCompleted = todoElement.classList.contains('completed');

    // Buscamos la tarea y actualizamos su propiedad 'completed'
    const todoIndex = todos.findIndex(todo => todo.text === todoText);
    if (todoIndex > -1) {
        todos[todoIndex].completed = isCompleted;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

// Función auxiliar para no repetir código de chequeo
function checkLocalStorage() {
    if (localStorage.getItem('todos') === null) {
        return [];
    } else {
        return JSON.parse(localStorage.getItem('todos'));
    }
}