const router = require("express").Router();
const Groups = require("../models/Groups");
//const groupConversation = require("../models/Groups");

//new conv

router.post("/", async (req, res) => {
  const newConversation = new Groups({
    groupName: req.body.groupName,
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update members

router.put("/addMember/:id", async (req, res) => {

  try {
    const conv = await Groups.findById(req.params.id);

    await conv.updateOne({ $push: { members: req.body.userId } });
    res.status(200).json("users addeed to group");
  } catch (err) {
    res.status(500).json(err);
  }

});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Groups.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get memberss of groups
router.get("/members/:userId", async (req, res) => {

  try {
    const user = await Groups.findById(req.params.userId);
    const friend1 = await Promise.all(
      user.members.map((friendId) => {
        return Groups.findById(friendId);
      })
    );
    // let friendList = [];
    // friend1.map((friend) => {
    //   const { _id } = friend;
    //   friendList.push({ _id });
    // });
    res.status(200).json(friend1)
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