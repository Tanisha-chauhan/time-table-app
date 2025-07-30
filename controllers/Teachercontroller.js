import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename= fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../Data/Teacherdata.json");

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


 export const handleTeacherSignup =async(req,res) =>
 {
    try{
      const {UserName,Email,password}=req.body;

      if(UserName ==="" || Email=== "" || password=== "")
        {
       return res.status(404).json({message:"All fiels are required"});
      }
      const teachers = await readData();
      const existingTeacher= teachers.find((teacher)=>teacher.Email === Email);
      if(existingTeacher)
      {
        res.status(409).json({message:"Teacher with this email is already registered"});
        return;
      }
      const newTeacher ={
        UserName,
        Email,
        password,
        id: Email,
        lectures: [],
      };
      teachers.push(newTeacher);
      await writeData(teachers);

      res.status(201).json({message:"Teacher registered successfully!"});
    }
    catch(error)
    {
        console.log("signup error:", error);
        res.status(500).json({message:"Server error. Please try Again"});
    }
 };

 export const handleTeacherLogin = async(req,res)=>{
    try
    {
        const {Email, password} = req.body;
       
        const teachers = await readData();
        const existingTeacher = teachers.find((teacher)=> teacher.Email === Email && teacher.password === password);
        
        if(existingTeacher)
        {
            req.session.isAuthenticated = true;
            req.session.Email = Email;
            return res.status(200).json({
              message:`Welcome, ${existingTeacher.UserName}`,
            UserName: existingTeacher.UserName,});
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

 export const getLoggedInTeacher = (req, res) => {
  if (req.session && req.session.Email) {
    res.status(200).json({ Email: req.session.Email });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
};

// teacher leave form
export async function handleLeaveRequest(req, res) {
  const { date, reason } = req.body;
  const teacherEmail = req.session.Email;
  console.log("Session Email:", req.session.Email);
console.log("Incoming leave request body:", req.body);

const dataDir = path.join(__dirname, "../Data");
const TeacherDataPath = path.join(dataDir, "Teacherdata.json");
const leavesPath = path.join(dataDir, "leaves.json");
const adjustmentsPath = path.join(dataDir, "adjustments.json");

console.log("Handling leave request - start", { date, reason, teacherEmail });

// Utility to get day name from a date string
  const getDayFromDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("en-US", { weekday: "long" });
  };
  const dayOfWeek = getDayFromDate(date);

const safeReadJSON = async (filePath, name) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    console.log(`Read ${name}:`, content ? content : 'empty');
    return content ? JSON.parse(content) : [];
  } catch (e) {
    console.error(`Error reading ${name}:`, e.message);
    return [];
  }
};

try {
  //save leave record
  const leaves = await safeReadJSON(leavesPath, 'leaves.json');
  leaves.push({ teacher: teacherEmail, date, reason });
  console.log("Writing leaves:", leaves);
  await fs.writeFile(leavesPath, JSON.stringify(leaves, null, 2));

  // Find teacher and their lectures from teacherdata.json
  const teachersData = await safeReadJSON(path.join(dataDir, "Teacherdata.json"), 'Teacherdata.json');
const teacher = teachersData.find(t => t.Email === teacherEmail);
const lectures = teacher?.lectures || [];
  console.log("Found lectures:", lectures);

  // Filter lectures for the leave date
 const teacherLectures = lectures.filter((lec) => lec.Day === dayOfWeek);
  console.log("Filtered lectures:", teacherLectures);

  //Add Adjustment request
  const adjustments = await safeReadJSON(adjustmentsPath, 'adjustments.json');
  teacherLectures.forEach((lec) => {
    adjustments.push({
      id: Date.now() + Math.random(),
      teacher: teacherEmail,
      subject: lec.Subject,
      time: `${lec.Start} - ${lec.End}`,
      className: lec.Room || "N/A",
      reason,
      date,
      status: "Pending"
    });
  });
  console.log("New adjustments array:", adjustments);
  await fs.writeFile(adjustmentsPath, JSON.stringify(adjustments, null, 2));

  console.log("Completed processing leave.");
  res.json({ message: "Leave submitted." });
} catch (err) {
  console.error("Error in leave handler:", err);
  res.status(500).json({ message: "Server error", error: err.message });
}
};

