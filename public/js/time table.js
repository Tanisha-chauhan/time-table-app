const select = document.getElementById("Teacher");
let teacherId = localStorage.getItem("teacherId");

const add=document.getElementById("btn4");
add.addEventListener("click",()=>{
  window.location.href="/html/form.html";
});

const log=document.getElementById("logbt");
log.addEventListener("click",()=>{
  window.location.href="/html/login as.html";
})

fetch("/admin/teachers")
  .then(res => res.json())
  .then(teachers => {
    select.innerHTML = "";
    teachers.forEach(teacher => {
      let option = document.createElement("option");
      option.value = teacher.Email;
      option.textContent = teacher.Email;
      select.appendChild(option);
    });

    if (teacherId) {
      select.value = teacherId;
      createCells(teacherId);
    } else {
      teacherId = select.value;
      localStorage.setItem("teacherId", teacherId);
      createCells(teacherId);
    }

    select.addEventListener("change", () => {
      teacherId = select.value;
      localStorage.setItem("teacherId", teacherId);
      createCells(teacherId);
    });
  });

function createCells(teacherId) {
  const tbody = document.querySelector("table tbody");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  tbody.textContent = "";

  fetch(`/admin/lectures/${teacherId}`)
    .then(res => res.json())
    .then(lectures => {
      days.forEach(day => {
        let row = document.createElement("tr");
        let th = document.createElement("th");
        th.textContent = day;
        row.appendChild(th);

        for (let i = 1; i <= 8; i++) {
          let match = lectures.find(
            value => value.Day === day && value.Lecture === `Lecture ${i}`
          );

          let td = document.createElement("td");
          if (match) {
            td.innerHTML = `
              <h2>${match.Subject}</h2>
              <medium>${match.Start} - ${match.End}</medium><br>
              <medium>${match.Room}</medium>
            `;
          }
          row.appendChild(td);
        }

        tbody.appendChild(row);
      });
    });
}
 function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

   const username = sessionStorage.getItem("adminUserName");     //for showing username 
  const span = document.getElementById("logged-user");

  if (username && span) {
    span.textContent = `${username} (Admin)`;
  }