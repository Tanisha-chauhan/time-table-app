let button=document.getElementById("button");

        button.addEventListener("click",async(e)=>{
            e.preventDefault();

        let Email=document.getElementById("Email").value;
        let password=document.getElementById("password").value;
             
            if(!Email||!password){
                alert("Please fill details");
                return;
            }
            
            const res = await fetch("/admin/login",{
              method: "POST",
              headers:{
                "Content-Type":"application/json"
              },
              body : JSON.stringify({Email, password}),
              credentials : "include"
            });

            const data = await res.json();
            console.log("Login response:", data); 
            if(res.status ===200)
            {
              alert(data.message);
               // Set sessionStorage here after successful login
               sessionStorage.setItem("adminUserName", data.UserName);
              window.location.href = "time table.html";
            }
            else
              {
              alert(data.message || "Login failed");
            }

          });


