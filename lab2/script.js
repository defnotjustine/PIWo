"use strict";

const lists = {
  "Mało pilne": [],
  "Pilne": [],
  "Na wczoraj": []
};

let deletedTaskInfo = null;
let pendingDelete = null;

function init() {
  const listSelect = document.getElementById("listSelect");
  const container = document.getElementById("listsContainer");

  listSelect.innerHTML = "";
  container.innerHTML = "";

  for (const listName in lists) {
    const option = document.createElement("option");
    option.value = listName;
    option.textContent = listName;
    listSelect.appendChild(option);

    const div = document.createElement("div");
    div.className = "mb-4";

    const header = document.createElement("h3");
    header.textContent = listName;
    header.className = "bg-secondary text-white p-2 rounded";
    header.style.cursor = "pointer";

    const ul = document.createElement("ul");
    ul.className = "list-group mt-2";

    header.onclick = () => {
      ul.style.display = ul.style.display === "none" ? "block" : "none";
    };

    for (const task of lists[listName]) {
      ul.appendChild(createTaskElement(task));
    }

    div.appendChild(header);
    div.appendChild(ul);
    container.appendChild(div);
  }

  document.getElementById("undoBtn").disabled = !deletedTaskInfo;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  if (task.done) li.classList.add("done");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;
  span.onclick = () => toggleDone(task);

  const buttonsDiv = document.createElement("div");

  if (task.done && task.date) {
    const date = document.createElement("span");
    date.className = "done-date me-2";
    date.textContent = `(${task.date})`;
    buttonsDiv.appendChild(date);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-danger";
  deleteBtn.textContent = "X";
  deleteBtn.onclick = () => showModal(task);

  buttonsDiv.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(buttonsDiv);

  return li;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  const listName = document.getElementById("listSelect").value;
  if (!text) return;

  const task = { text, done: false };
  lists[listName].push(task);
  input.value = "";
  init();
}

function toggleDone(task) {
  task.done = !task.done;
  if (task.done) {
    task.date = new Date().toLocaleString();
  } else {
    delete task.date;
  }
  init();
}

function showModal(task) {
  pendingDelete = task;
  const modal = document.getElementById("confirmModal");
  document.getElementById("modalText").textContent =
    `Czy na pewno chcesz usunąć zadanie o treści: "${task.text}"`;
  modal.style.display = "flex";
}

function confirmDelete() {
  const listName = findListName(pendingDelete);
  const list = lists[listName];
  const index = list.indexOf(pendingDelete);

  if (index !== -1) {
    deletedTaskInfo = {
      task: pendingDelete,
      listName,
      index
    };
    list.splice(index, 1);
  }

  closeModal();
  init();
}

function cancelDelete() {
  closeModal();
}

function closeModal() {
  document.getElementById("confirmModal").style.display = "none";
  pendingDelete = null;
}

function undoDelete() {
  if (deletedTaskInfo) {
    const { task, listName, index } = deletedTaskInfo;
    lists[listName].splice(index, 0, task);
    deletedTaskInfo = null;
    init();
  }
}

function addList() {
  const input = document.getElementById("newListInput");
  const newList = input.value.trim();
  if (!newList || lists[newList]) return;

  lists[newList] = [];
  input.value = "";
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
  const listsDivs = container.querySelectorAll(".list-group");

  Object.keys(lists).forEach((listName, idx) => {
    const ul = listsDivs[idx];
    ul.innerHTML = "";

    for (const task of lists[listName]) {
      if (regex.test(task.text)) {
        ul.appendChild(createTaskElement(task));
      }
    }
  });
}

window.onload = init;
