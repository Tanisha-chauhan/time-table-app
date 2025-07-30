let button=document.getElementById("button");

        button.addEventListener("click",async(e)=>{
            e.preventDefault();

        let Email=document.getElementById("Email").value;
        let password=document.getElementById("password").value;
             
            if(!Email||!password){
                alert("Please fill details");
            }
            
            const res = await fetch("/teacher/login",{
              method: "POST",
              headers:{
                "Content-Type":"application/json"
              },
              body : JSON.stringify({Email, password}),
              credentials : "include"   //required for session cookie
            });

            const data = await res.json();
            console.log("Login response:", data);

            if(res.status ===200)
            {
              alert(data.message);
               // Set sessionStorage here after successful login
               sessionStorage.setItem("teacherUserName", data.UserName);
              window.location.href = "teachertable.html";
            }
            else
              {
              alert(data.message || "Login failed");
            }

          });



