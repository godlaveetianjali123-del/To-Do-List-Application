const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

filterButtons.forEach(button => {
    button.addEventListener("click", function () {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();

    });
});

taskList.addEventListener("click", function (e) {

    if (e.target.classList.contains("delete-btn")) {

        const id = Number(e.target.dataset.id);

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();

        renderTasks();

    }

    if (e.target.classList.contains("edit-btn")) {

        const id = Number(e.target.dataset.id);

        const task = tasks.find(task => task.id === id);

        const newText = prompt("Edit Task", task.text);

        if (newText !== null && newText.trim() !== "") {

            task.text = newText.trim();

            saveTasks();

            renderTasks();

        }

    }

});
taskList.addEventListener("change", function (e) {

    if (e.target.classList.contains("complete")) {

        const id = Number(e.target.dataset.id);

        const task = tasks.find(task => task.id === id);

        if (task) {

            task.completed = e.target.checked;

            saveTasks();

            renderTasks();

        }

    }

});
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;

    }

    const task = {

        id: Date.now(),

        text: text,

        completed: false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();

}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(task => !task.completed);

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-message">
                No Tasks Found
            </li>
        `;

        return;

    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    class="complete"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

}
renderTasks();
