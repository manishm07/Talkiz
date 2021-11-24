const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //get conv includes two userId

// router.get("/find/:userId", async (req, res) => {
//   try{
  
//       const user = await User.findOne({members:req.params.userId,members:req.body.id});
//       res.status(200).json(user);
//       console.log(user);
    
//   }catch(err){
//     res.status(500).json(err);
//   }
// });

module.exports = router;