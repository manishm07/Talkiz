import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const [toggle, setToggle] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + friendId);
        if (res.data.blocked.includes(currentUser._id)) {
          setUser(null);
          setToggle(true);
        }
        else if (res.data.blockedBy.includes(currentUser._id)) {
          setUser(null);
          setToggle(true);
        } else {
          setUser(res.data);
        }
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div>
      {!toggle ?
        <div className="conversation">
          <img
            className="conversationImg"
            /*src={
              user?.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }*/
            src={PF + "person/noAvatar.png"
            }
            alt=""
          />
          <span className="conversationName">{user?.username}</span>
        </div>
        :
        <div></div>
      }
    </div>
  );
}