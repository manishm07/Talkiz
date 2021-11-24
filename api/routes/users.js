
const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { constants } = require("fs");

//update user password
router.put("/passUpdate/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (validPassword) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newpassword, salt);
        const user = await User.findByIdAndUpdate(req.params.userId, {
          $set: { password: hashedPassword }
        });
        res.status(200).json("Password updated");
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(400).json("wrong password");
    }
    res.status(200).json("password updated");
    res.json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

//update user password from login page......
router.put("/logpassUpdate/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    !user && res.status(404).json("user not found");
    
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.findOneAndUpdate({email:req.params.email}, {
          $set: { password: hashedPassword }
        });
        res.status(200).json("Password updated");
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    res.status(200).json("password updated");
    res.json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

//update user password from login page......
router.put("/updatePhone/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    !user && res.status(404).json("user not found");
    
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await User.findOneAndUpdate({phone:req.params.phone}, {
          $set: { password: hashedPassword }
        });
        res.status(200).json("Password updated");
        res.json(user);
      } catch (err) {
        res.status(500).json(err);
      }
    res.status(200).json("password updated");
    res.json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});


//get user thorogh phone......
router.get("/userDetail/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    // !user && res.status(200).json(false);
    if(user){
      res.json(true);
    }else{
      res.json(false);
    }
    

   
  } catch (err) {
    res.status(500).json(err)
  }
});


//profile data change/update
router.put("/profile/:id", async (req, res) => {
 
   
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
        
      });
      res.status(200).json("Account has been updated");
      res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  
  
});





//email update
router.put("/inUpdate/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $set: req.body
    });
    res.status(200).json("email and phone updated");
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update email and phone
// router.post("/update", async (req, res) => {
//   const userId = req.query.userId;
//   const username = req.query.username;
//     try {
//       const user = userId
//       ? await User.findById(userId)
//       : await User.findOne({ username: username });


//       const updateUser= {

//         email: req.body.email,


//       };

//       //save user and respond
//       const user = await updateUser.save();
//       res.status(200).json(user);


//     } catch (err) {
//       res.status(500).json(err);
//     }

// });


//conversation assigned to user and his friends
router.post("/conversation/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sendingUser = await User.findById(req.body.userId);

      await user.updateOne({ $push: { conversationId: req.body.userId } });
      await sendingUser.updateOne({ $push: { conversationId: req.params.id } });
      res.status(200).json("conversation id assigned");
  } catch (err) {
    res.status(500).json(err);
  }

});


//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend1 = await Promise.all(
      user.friends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friend1.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//get blocked friends
router.get("/blocked/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend1 = await Promise.all(
      user.blocked.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friend1.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});


//get notifications
router.get("/notification/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.requestFrom.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }
});

//send friend request

router.put("/:id/sendRequest", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const sendingUser = await User.findById(req.body.userId);

        await user.updateOne({ $push: { requestTo: req.body.userId } });
        await sendingUser.updateOne({ $push: { requestFrom: req.params.id } });
        res.status(200).json("friend request send");
    } catch (err) {
      res.status(500).json(err);
    }
});

//add conversartion id 

// router.put("/:id/addConvoId", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const sendingUser = await User.findById(req.body.userId);
//     await user.updateOne({ $push: { conversationId: req.body.userId } });
//     await sendingUser.updateOne({ $push: { conversationId: req.params.id } });
//       res.status(200).json("friend request send");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });



//accept friend request
router.put("/:id/acceptRequest", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sendingUser = await User.findById(req.body.userId);

      await user.updateOne({ $push: { friends: req.body.userId } });
      await sendingUser.updateOne({ $push: { friends: req.params.id } });
      res.status(200).json("friend request accepted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Cancel friend request

router.put("/:id/cancelRequest", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const sendingUser = await User.findById(req.body.userId);

        await user.updateOne({ $pull: { requestTo: req.body.userId } });
        await sendingUser.updateOne({ $pull: { requestFrom: req.params.id } });
        res.status(200).json("friend frequest is cancelled");
    } catch (err) {
      res.status(500).json(err);
    }
});

//unfriend

router.put("/:id/unfriend", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sendingUser = await User.findById(req.body.userId);

      await user.updateOne({ $pull: { friends: req.body.userId } });
      await sendingUser.updateOne({ $pull: { friends: req.params.id } });
      res.status(200).json("unfriend");
  } catch (err) {
    res.status(500).json(err);
  }
});

//block a friend

router.put("/:id/block", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sendingUser = await User.findById(req.body.userId);

      await user.updateOne({ $push: { blockedBy: req.body.userId } });
      await sendingUser.updateOne({ $push: { blocked: req.params.id } });

      res.status(200).json("blocked");
  } catch (err) {
    res.status(500).json(err);
  }
});

//unblock a friend

router.put("/:id/unblock", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sendingUser = await User.findById(req.body.userId);

      //await user.updateOne({ $pull: { friends: req.body.userId } });
      await sendingUser.updateOne({ $pull: { blocked: req.params.id } });
      res.status(200).json("unblocked");
  } catch (err) {
    res.status(500).json(err);
  }
});




//sample for searching with email and name
router.get("/search",async (req,res) => {
  try{
    const reqData = JSON.parse(req.query.data);
    
    if(reqData.username){
      const user = await User.findOne({username:reqData.username});
      res.status(200).json(user);
      console.log(user);
    }else if(reqData.email){
      const user = await User.findOne({email:reqData.email});
      res.status(200).json(user);
      console.log(user);
    }else{
      res.status(404).json("user not found");
    }
  }catch(err){
    res.status(500).json(err);
  }
});


module.exports = router;

