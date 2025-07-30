    let button=document.getElementById("button");
        let button1=document.getElementById("button1");

        button.addEventListener("click",async(e)=>{
                e.preventDefault();

            let UserName=document.getElementById("UserName").value;
            let Email=document.getElementById("Email").value;
            let password=document.getElementById("password").value;
             
            if(!UserName||!Email||!password){
                alert("Please fill details");
                return;
            }
            
            try{
                const res =  await fetch("/teacher/signup",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({UserName,Email,password})
                });
                const result = await res.json();
                console.log(result);

                if(res.ok){
                    alert(result.message);
                    // 🔐 Store UserName for later use
                        sessionStorage.setItem("teacherUserName", UserName);
                    window.location.href="/html/Teacherlogin.html";
                }
                else{
                    alert(result.message || "Signup failed");
                }
            }
            catch (error){
                console.error("Error during signup:", error);
                alert("Something went wrong. Try again later");
            }
        });

        button1.addEventListener("click", (e) => {
         e.preventDefault();
        window.location.href="/html/Teacherlogin.html";
});
