 const leave=document.getElementById("leave-form");
 leave.addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = document.getElementById("leave-date").value;
    const reason = document.getElementById("leave-reason").value;

    const res = await fetch("/teacher/leave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason })
    });

    const data = await res.json();
    alert(data.message);
    window.location.href="/html/teachertable.html";
  });
