import express from "express";
import session from "express-session";
import adminRouter from "./routers/adminRouter.js";
import teacherRouter from "./routers/teacherRouter.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

app.use(session({
    secret: "xyz000",
    saveUninitialized: false,
    resave:false
}));

//  Force root path to open main.html from html folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "login as.html"));
});


app.use("/admin",adminRouter);
app.use("/teacher", teacherRouter);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
