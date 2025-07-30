window.addEventListener("DOMContentLoaded", () => {
  loadAdjustments();
});

async function loadAdjustments() {
  const container = document.getElementById("adjustments");
  if (!container) {
    console.error("Element with ID 'adjustments' not found");
    return;
  }

  try {
    const res = await fetch("/admin/adjustments");
    const data = await res.json();

    // Group adjustments by teacher+date+reason
    const grouped = {};

    data.forEach(adj => {
      const key = `${adj.teacher}|${adj.date}|${adj.reason}`;
      if (!grouped[key]) {
        grouped[key] = {
          teacher: adj.teacher,
          date: adj.date,
          reason: adj.reason,
          lectures: []
        };
      }
      grouped[key].lectures.push(adj);
    });

    // Render grouped adjustments
    container.innerHTML = Object.values(grouped).map(group => {
      const lecturesHTML = group.lectures.map((lec, i) => `
        • <strong>Lecture ${i + 1}</strong> | <strong>Subject:</strong> ${lec.subject} | <strong>Room:</strong> ${lec.className} | <strong>Time:</strong> ${lec.time}<br>
      `).join('');

      return `
        <div style="border:1px solid #ccc; box-shadow:0 3px 10px rgba(0,0,0,0.8);margin:10px; padding:10px;">
          <p><strong>${group.teacher}</strong></p>
          <p><strong>Date:</strong> ${group.date}</p>
          <p><strong>Reason:</strong> ${group.reason}</p>
          <p><strong>Timetable:</strong><br>${lecturesHTML}</p>
          <button class="Approve" style="height:35px; width:75px;margin-right:30px; background-color:rgba(234, 87, 185, 0.8);box-shadow:0 3px 10px rgba(0,0,0,0.8);" onclick="adjust('${group.lectures[0].id}')">Approve</button>
          <button class="Reject" style="height:35px; width:75px;background-color:rgba(234, 87, 185, 0.8);box-shadow:0 3px 10px rgba(0,0,0,0.8); ">Reject</button>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error("Error loading adjustments:", err);
    container.innerHTML = "<p>Failed to load data</p>";
  }
}


async function adjust(id) {
  console.log("adjust() called with ID:", id);

  const panel = document.getElementById("substitutePanel");
  const list = document.getElementById("substituteList");

  if (!panel || !list) {
    console.error("Panel or list not found");
    return;
  }

  panel.style.display = "block";
  list.innerHTML = "Loading...";

  try {
    // Step 1: Find the teacher who requested leave
    const adjustmentsRes = await fetch("/admin/adjustments");
    const allAdjustments = await adjustmentsRes.json();
    const currentAdjustment = allAdjustments.find(adj => adj.id === Number(id));

    if (!currentAdjustment) {
      list.innerHTML = "<p>Adjustment not found</p>";
      return;
    }

    const leaveTeacherEmail = currentAdjustment.teacher; // 👈 get the teacher to exclude

    // Step 2: Get all teachers
    const teachersRes = await fetch("/admin/teachers");
    const teachers = await teachersRes.json();

    // Step 3: Filter out the leave teacher
    const availableTeachers = teachers.filter(t => t.Email !== leaveTeacherEmail);

    // Step 4: Render remaining teachers
    list.innerHTML = availableTeachers.map(t => `
      <div style="margin:10px 0; padding:10px; border:1px solid #ddd;">
        ${t.Email}
        <button onclick="assignSubstitute('${id}', '${t.Email}')" style="margin-left:45%; background-color:rgba(234, 87, 185, 0.8)">Request</button>
      </div>
    `).join("");

  } catch (err) {
    list.innerHTML = "<p>Error loading teachers</p>";
    console.error(err);
  }
}

async function assignSubstitute(id, email) {
  try {
    const res = await fetch(`/admin/adjustments/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ substituteEmail: email })
    });
    const data = await res.json();
    alert(data.message || "Assigned!");
    closeSubstitutePanel();
    loadAdjustments(); // refresh adjustments
  } catch (err) {
    alert("Failed to assign");
    console.error(err);
  }
}

function closeSubstitutePanel() {
  document.getElementById("substitutePanel").style.display = "none";
}


