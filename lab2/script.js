"use strict";

let lists = {
  "Mało pilne": [],
  "Pilne": [],
  "Na wczoraj": []
};

let deletedTask = null;
let deleteTarget = null;

function init() {
  const listSelect = document.getElementById("listSelect");
  const container = document.getElementById("listsContainer");

  listSelect.innerHTML = "";
  container.innerHTML = "";

  Object.keys(lists).forEach(listName => {
    const option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    listSelect.appendChild(option);

    const div = document.createElement("div");
    div.className = "list";

    const header = document.createElement("h2");
    header.textContent = listName;
    header.onclick = () => {
      ul.style.display = ul.style.display === "none" ? "block" : "none";
    };

    const ul = document.createElement("ul");
    lists[listName].forEach(task => {
      ul.appendChild(createTaskElement(task));
    });

    div.appendChild(header);
    div.appendChild(ul);
    container.appendChild(div);
  });
}

function createTaskElement(task) {
  const li = document.createElement("li");
  if (task.done) li.classList.add("done");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  span.onclick = () => toggleDone(task, li);

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  if (task.done && task.date) {
    const date = document.createElement("span");
    date.className = "done-date";
    date.textContent = `(${task.date})`;
    buttonsDiv.appendChild(date);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => showModal(task);

  buttonsDiv.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(buttonsDiv);

  return li;
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const listName = document.getElementById("listSelect").value;
  if (!text) return;

  const task = { text, done: false };
  lists[listName].push(task);
  document.getElementById("taskInput").value = "";
  init();
}

function toggleDone(task, li) {
  task.done = !task.done;
  if (task.done) {
    task.date = new Date().toLocaleString();
  } else {
    delete task.date;
  }
  init();
}

function showModal(task) {
  deletedTask = task;
  deleteTarget = findListName(task);
  document.getElementById("modalText").textContent =
    `Czy na pewno chcesz usunąć zadanie o treści: "${task.text}"`;
  document.getElementById("confirmModal").style.display = "flex";
}

function confirmDelete() {
  lists[deleteTarget] = lists[deleteTarget].filter(t => t !== deletedTask);
  document.getElementById("confirmModal").style.display = "none";
  init();
}

function cancelDelete() {
  deletedTask = null;
  deleteTarget = null;
  document.getElementById("confirmModal").style.display = "none";
}

function addList() {
  const newList = document.getElementById("newListInput").value.trim();
  if (!newList || lists[newList]) return;
  lists[newList] = [];
  document.getElementById("newListInput").value = "";
  init();
}

function findListName(taskToFind) {
  return Object.keys(lists).find(listName =>
    lists[listName].includes(taskToFind)
  );
}

function searchTasks() {
  const query = document.getElementById("searchInput").value;
  const caseInsensitive = document.getElementById("caseCheckbox").checked;
  const regex = new RegExp(query, caseInsensitive ? "i" : "");

  const container = document.getElementById("listsContainer");
  const listsDivs = container.getElementsByClassName("list");

  Object.keys(lists).forEach((listName, idx) => {
    const ul = listsDivs[idx].querySelector("ul");
    ul.innerHTML = "";

    lists[listName].forEach(task => {
      if (regex.test(task.text)) {
        ul.appendChild(createTaskElement(task));
      }
    });
  });
}

window.onload = init;
