fetch("/teacher/profile", {
  method: "GET",
  credentials: "include"
})
  .then(res => {
    if (!res.ok) {
      throw new Error("Not logged in");
    }
    return res.json();
  })
  .then(({ Email }) => {
    fetch(`/admin/lectures/${Email}`)
      .then(res => res.json())
      .then(lectures => {
        const tbody = document.querySelector("table tbody");
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        tbody.textContent = "";

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
  })
  .catch(err => {
    console.error(err);
    alert("Please login first");
    window.location.href = "/html/Teacherlogin.html";
  });

  const log = document.getElementById("logbts");
  log.addEventListener("click",()=>{
    window.location.href="/html/login as.html";
  })
 function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, options);
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

   const username = sessionStorage.getItem("teacherUserName");     //for showing username 
  const span = document.getElementById("logged-user");

  if (username && span) {
    span.textContent = `${username} (Teacher)`;
  }