import User from "..model/userModel.js";

export const create = async(req, res) =>{
    try {
           const newUser = new User(req.body);
           const {email} = newUser;

           const userExit = await User.findOne({email})
           if(userExist){
                  return res.status(400).json({ messenge: "User already exist." });
           } 
           const savedData = await  email.save();
           res.status (200).json(savedData);
    } catch (error) {
        res.status(500).json({ errorMessenge:error.messenge })
    }
};

export const getALLUsers = async(req, res) =>{
    try{
        const userData = await User.find ();
        if(!userData || userData.length === 0){
            return res.status(404).json({messenge :"User data not found."});
        }
        res.status(200).json(userData)
    } catch (error) {
        res.status(500).json({ errorMessenge: error.messenge });
    }
};

export const getUserById = async (req, res) =>{
       try {
          const id = req.params.id;
          const userExist = await User.findById(id);
          if(!userExist){
            return res.status(404).json({messenge :"User not found."});
          }
          res.json(200).json(userExist)

       } catch (error) {
        res.status(500).json({ errorMessage: error.message });

       } 
};

export const update = async (req, res)=>{
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
           return res.status(404).json({message: "User not found."});
          }
       const updatedData = await User.findByIdAndUpdate(id, req.body, { 
        new:true,
       })
       res.status(200).json(updatedData) 

    } catch ( error )  {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try{    
        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
           return res.status(404).json({message: "User not found."});
          }
      await User.findByIdAndDelete(id);
      res.status(200).json({message:"User deleted succesfully." });
    } catch (error) {
           res.status(500).json({ errorMessage: error.message });
    }
}
