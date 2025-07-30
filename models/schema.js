// import mongoose from "mongoose";
// import User from "./trys.js"; // adjust the path as needed

// // Connect to MongoDB first
// mongoose.connect("mongodb://127.0.0.1:27017/timetable")
// .then(async () => {
//   console.log("MongoDB connected ✅");

//   // Insert user
//   const newUser = new User({
//     name: "abc",
//     password: "abc"
//   });

//   await newUser.save();
//   console.log("User inserted successfully ✅");

//   mongoose.disconnect();
// })
// .catch((err) => {
//   console.error("MongoDB connection error ❌", err);
// });
