const submitBtn = document.getElementById("Save");
let form = JSON.parse(localStorage.getItem("form")) || [];
let Cancel=document.querySelector(".Cancel");

let id = localStorage.getItem("teacherId");

function addToFormArray(id, Lecture, Subject, Start, End, Room, Day) {
    const obj = {
        id: id,
        Lecture: Lecture,
        Subject: Subject,
        Start: Start,
        End: End,
        Room: Room,
        Day: Day,
    };

    form.push(obj);
    localStorage.setItem("form", JSON.stringify(form));
    console.log(obj);
}

// On form submit
if (submitBtn) {
    submitBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        let Lecture = document.getElementById("Lecture").value;
        let Subject = document.getElementById("Subject").value;
        let timeSlot = document.getElementById("TimeSlot").value;
        let [startRaw, endRaw] = timeSlot.split("-");
        let Start = convertTo12Hour(startRaw);
        let End = convertTo12Hour(endRaw);
        let Room = document.getElementById("Room").value;
        let Day = document.getElementById("Day").value;

        function convertTo12Hour(timeStr) {
      let [hour, minute] = timeStr.split(":").map(Number);
      let ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12; // convert 0 -> 12
      return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

        if (!Lecture || !Subject || !timeSlot || !Room || !Day) {
            alert("Please fill all details");
            return;
        }

         // Check teacherID or not before adding
        if (!id) {
            alert("Teacher ID is not set. Please select a teacher first.");
            return;
        }

        try{
        const res = await fetch("/admin/add-lectures", {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
       },
      body: JSON.stringify({ id, Lecture, Subject, Start, End, Room, Day }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + data.message);
        return;
      }
      alert(data.message);

        window.location.href = "/html/time table.html";
    }
    catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong");
    }
    });
};

    Cancel.addEventListener("click", function () {
        window.location.href = "/html/time table.html";
    });

