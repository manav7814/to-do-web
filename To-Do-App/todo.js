let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editIndex = null;

function saveLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function openAddModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function saveTask() {
  const name = document.getElementById("taskName").value;
  const date = document.getElementById("taskDate").value;

  if (!name || !date) return alert("Fill all fields");

  if (editIndex !== null) {
    tasks[editIndex].name = name;
    tasks[editIndex].date = date;
    editIndex = null;
  } else {
    tasks.push({
      name,
      date,
      completed: false
    });
  }

  saveLocal();
  renderTasks();
  closeModal();
}

function editTask(index) {
  document.getElementById("taskName").value = tasks[index].name;
  document.getElementById("taskDate").value = tasks[index].date;
  editIndex = index;
  openAddModal();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveLocal();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveLocal();
  renderTasks();
}

function isToday(date) {
  return new Date(date).toDateString() === new Date().toDateString();
}

function isOverdue(date) {
  return new Date(date) < new Date() && !isToday(date);
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const completedList = document.getElementById("completedList");

  taskList.innerHTML = "";
  completedList.innerHTML = "";

  tasks.forEach((task, index) => {

    if (currentFilter === "today" && !isToday(task.date)) return;
    if (currentFilter === "pending" && (task.completed || isOverdue(task.date))) return;
    if (currentFilter === "overdue" && !isOverdue(task.date)) return;

    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
        <span class="${task.completed ? 'completed' : ''}">${task.name}</span>
        <br>
        <small>${task.date}</small>
      </div>

      <div class="actions">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    if (task.completed) {
      completedList.appendChild(div);
    } else {
      taskList.appendChild(div);
    }
  });
}

renderTasks();
