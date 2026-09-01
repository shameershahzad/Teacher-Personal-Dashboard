const express = require("express")
const jwt = require("jsonwebtoken")
const registerModel = require("../model/registerModel")
const bcrypt = require("bcrypt")
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerModel.findOne({email});

    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
const refreshToken = jwt.sign({ id: user._id, type: "refresh" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Success", token, refreshToken });
  } catch (err) {
    console.error(err);
   return res.status(500).json({ message: "Server error" });
  }
});

router.post("/refreshToken", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token expired or invalid" });
  }
});
    
router.post("/signUp",async(req,res) => {
 const {name,email,password} = req.body;

 try{
    const checkEmail = await registerModel.findOne({email})

    if(checkEmail){
         return res.status(404).json({message:"Email already exist"})
    }
    const hashPassword = await bcrypt.hash(password,10)

    const user = await registerModel.create({name:req.body.name,email:req.body.email,password:hashPassword})

    return res.status(200).json({result:user,message:"SignUp successfully!"})
 }catch(err){
    return res.status(500).json({error:err.message})
 }

})

router.post("/verifyEmail",async(req,res) => {
    const {email} = req.body;
try{
    const foundEmail = await registerModel.findOne({email})
    if(!foundEmail){
        return res.status(404).json({message:"Email doesn't exist"})
    }
    return res.status(200).json({message:"Email found"})

}catch(err){
    return res.status(500).json({error:err.message})
}
})

router.put("/updatePassword/:email",async(req,res) => {
    const {newPassword} = req.body;
    if(!newPassword || !newPassword.trim()){
        return res.status(400).json({message:"Password cannot be empty"})
    }
    try{
        const hashPassword = await bcrypt.hash(newPassword,10)
    
         const updatePass = await registerModel.updateOne({email:req.params.email},{$set:{password:hashPassword}});
         if(updatePass){
            return res.status(200).json({message:"Password updated"})
         }
    }catch(err){
            return res.status(500).json({error:err})
    }
})


module.exports = router;