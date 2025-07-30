import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename= fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../Data/Admindata.json');
const teacherDataPath = path.join(__dirname, '../Data/Teacherdata.json');

const readData = async()=>
    {
    try{
        await fs.access(dataFilePath);    //check if file exists.
        const data = await fs.readFile(dataFilePath,"utf-8");
        return JSON.parse(data);
    }
    catch(err){
        return [];                 //file doesn't exists or other error- return empty array
    }
};

const writeData = async(data)=>
{
   await fs.writeFile(dataFilePath,JSON.stringify(data,null,2),"utf-8");
}

 // read teacher data
const readTeacherData = async () => {
  try {
    await fs.access(teacherDataPath);
    const data = await fs.readFile(teacherDataPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty if file doesn't exist
  }
};

// write teacher data
const writeTeacherData = async (data) => {
  await fs.writeFile(teacherDataPath, JSON.stringify(data, null, 2), "utf-8");
};


 export const handleAdminSignup =async(req,res) =>
 {
    try{
      const {UserName,Email,password}=req.body;

      if(UserName ==="" || Email=== "" || password=== "")
        {
       return res.status(404).json({message:"All fiels are required"});
      }
      const admins = await readData();
      const existingAdmin= admins.find((admin)=>admin.Email === Email);
      if(existingAdmin)
      {
        res.status(409).json({message:"Admin with this email is already registered"});
        return;
      }
      const newAdmin ={
        UserName,
        Email,
        password
      };
      admins.push(newAdmin);
      await writeData(admins);

      res.status(201).json({message:"Admin registered successfully!"});
    }
    catch(error)
    {
        console.log("signup error:", error);
        res.status(500).json({message:"Server error. Please try Again"});
    }
 };

 export const handleAdminLogin = async(req,res)=>{
    try
    {
        const {Email, password} = req.body;
       
        const admins = await readData();
        const existingAdmin = admins.find((admin)=> admin.Email === Email && admin.password === password);
        
        if(existingAdmin)
        {
            req.session.isAuthenticated = true;
            req.session.Email = Email;
            return res.status(200).json({ 
             message:`Welcome, ${existingAdmin.UserName}`,
             UserName: existingAdmin.UserName,});
        }
        else{
            return res.status(401).json({message: "Invalid email or password"});
        }
    }
    catch(error){
        console.log("Login error:",error);
        res.status(500).json({message:"Server error"});
    }
 }

//  Add Lecture 
export const addLectures = async (req, res) => {
  const { id, Lecture, Subject, Start, End, Room, Day } = req.body;

  if (!id || !Lecture || !Subject || !Start || !End || !Room || !Day) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const teachers = await readTeacherData();
  const index = teachers.findIndex((t) => t.Email === id || t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const lecture = { id, Lecture, Subject, Start, End, Room, Day };

  if (!Array.isArray(teachers[index].lectures)) {
    teachers[index].lectures = [];
  }

  teachers[index].lectures.push(lecture);
  await writeTeacherData(teachers); 

  res.status(200).json({ message: "Lecture added successfully", data: lecture });
};

//  Get All Teachers 
export const getAllTeachers = async (req, res) => {
  const teachers = await readTeacherData();
  const list = teachers.map((t) => ({ Email: t.Email, id: t.id || t.Email }));
  res.json(list);
};

//  Get Lectures by Teacher
export const getLecturesByTeacher = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching lectures for:", id);
  const teachers = await readTeacherData();
  console.log("Teachers found:", teachers.map(t => t.Email)); 
  const teacher = teachers.find((t) => t.Email === id || t.id === id);

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  console.log("Lectures of found teacher:", teacher.lectures); 
  res.json(teacher.lectures || []);
}; 
  
//Admin Adjustment 

const adjustmentsPath = path.join("data", "adjustments.json");

export async function getPendingAdjustments(req, res) {
  try {
   const raw = await fs.readFile(adjustmentsPath, "utf-8");
   const data = raw.trim() ? JSON.parse(raw) : [];
    const pending = data.filter((adj) => adj.status === "Pending");
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
}

export async function resolveAdjustment(req, res) {
  const id = Number(req.params.id);
  try {
    const data = JSON.parse(await fs.readFile(adjustmentsPath, "utf-8") || "[]");
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) return res.status(404).json({ message: "Not found" });

    data[index].status = "Resolved";
    await fs.writeFile(adjustmentsPath, JSON.stringify(data, null, 2));
    res.json({ message: "Marked as resolved" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
}

