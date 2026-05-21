const addBtn = document.getElementById("add-btn");
const modal = document.getElementById("add-modal");
const closeBtn = document.getElementById("close-btn");
const submitBtn = document.getElementById("submit-btn");
const emptyStatus = document.getElementById("empty-status");
const errorDate = document.getElementById("error-date");
const errorName = document.getElementById("error-name");

// current mode = add task
let mode = "add";

//saved task
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTask = null;


function clearErrors() {
  errorName.textContent = "";
}

// if i delete or edit task -> show message
function showMessage(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  // wait before hide
  setTimeout(function () {
    toast.classList.add("hidden");
  }, 1500);
}

// add button click
addBtn.addEventListener("click", function () {
  clearErrors();
  mode = "add";
  currentTask = null;

  document.getElementById("modal-title").textContent = "إضافة مهمة";
  submitBtn.textContent = "إضافة مهمة";

  // clear all details
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  document.getElementById("status").value = "جديدة";

  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", function () {
  clearErrors();
  modal.classList.add("hidden");
});

submitBtn.addEventListener("click", function () {
  // get it from the user
  const taskName = document.getElementById("name").value.trim();
  const taskDescription = document.getElementById("description").value;
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;


  clearErrors();

  // no errors yet
  let hasError = false;

  if (taskName === "") {
    errorName.textContent = "اكتب اسم المهمة";
    hasError = true;
  }
  if(hasError){
    return; // stop function
  }
 
  // new task object
  if (mode === "add") {
    const newTask = {
      name: taskName,
      description: taskDescription,
      date: date,
      status: status
    };
    // add task to array
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks)); // save task


    // show confetti
    if (status === "مكتملة") {
      showConfetti();
      setTimeout(function () {
        location.reload();
      }, 1200);
    } else {
      location.reload();
    }
 
    // normal reload -> without confetti
  } else {
    const oldStatus = currentTask.status;

    const noChanges =
      currentTask.name === taskName &&
      currentTask.description === taskDescription &&
      currentTask.status === status &&
      currentTask.date === date;

    if (noChanges) {
      errorName.textContent = "لم يتم التعديل";
      return;
    }

    currentTask.name = taskName;
    currentTask.description = taskDescription;
    currentTask.date = date;
    currentTask.status = status;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    showMessage("تم التعديل بنجاح");

    if (oldStatus !== "مكتملة" && status === "مكتملة") {
      showConfetti();
    }
    setTimeout(function () {
      location.reload();
    }, 1200);
  }
});

// page click
document.addEventListener("click", function (event) {
  if (
    !modal.classList.contains("hidden") && 
    !modal.contains(event.target) && // clicked outside
    event.target !== addBtn &&
    !event.target.closest(".edit-btn") &&
    !event.target.closest(".delete-btn")
  ) {
    clearErrors();
    modal.classList.add("hidden");
  }
});

function createTask(task) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");

  const nameElement = document.createElement("div");
  nameElement.textContent = task.name;

  const descElement = document.createElement("div");
  descElement.textContent = task.description;

  const dateElement = document.createElement("span");
  dateElement.textContent = task.date || "";

  const actions = document.createElement("div");
  actions.classList.add("task-actions");

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`; // edit icon

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`; // delete icon

  actions.appendChild(deleteBtn);
  actions.appendChild(editBtn);

  taskCard.appendChild(nameElement);
  taskCard.appendChild(descElement);
  taskCard.appendChild(dateElement);
  taskCard.appendChild(actions);

  editBtn.addEventListener("click", function () {
    clearErrors();
    mode = "edit";
    currentTask = task;

    document.getElementById("name").value = task.name;
    document.getElementById("description").value = task.description;
    document.getElementById("date").value = task.date;
    document.getElementById("status").value = task.status;

    // change title
    document.getElementById("modal-title").textContent = "تعديل المهمة";
    submitBtn.textContent = "حفظ التعديل";

    modal.classList.remove("hidden");
  });

  deleteBtn.addEventListener("click", function () {
    tasks = tasks.filter(function (t) {
     // remove this task form the array
      return t !== task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskCard.remove();
    updateEmptyStatus(); 
     showMessage("تم الحذف بنجاح");

   
  });
  // selected column
  let column;

  if (task.status === "مكتملة") {
    column = document.getElementById("done-column");
  } else if (task.status === "قيد التنفيذ") {
    column = document.getElementById("doing-column");
  } else {
    column = document.getElementById("todo-column");
  }

  column.appendChild(taskCard); // add card
}

function updateEmptyStatus() {
  const taskCards = document.querySelectorAll(".task-card"); // get cards

  if (taskCards.length === 0) { // no tasks
    emptyStatus.style.display = "block"; // show empty
  } else {
    emptyStatus.style.display = "none"; // hide empty
  }
}

function showConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 1 }
  });
}

tasks.forEach(function (task) {
  createTask(task);
});

updateEmptyStatus();