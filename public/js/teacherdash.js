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