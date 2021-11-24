import "./message.css";
import { format } from "timeago.js";
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext";

export default function Message({ message, own }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [img, setImg] = useState(false);
  const [both, setBoth] = useState(false);
  const [Me, setMe] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      console.log(message);
      if (message._id !== user._id) {
        setMe(false);
        if (message.image !== null) {
          if (message.text !== "") {
            setBoth(false);
          } else {
            setImg(true);
          }
        } else {
          setBoth(true);
        }
      } else {
        setMe(true);
      }
    };
    fetchUser();
  }, [message]);

  return (
    <div className={own ? "message own" : "message"}>
      {!Me ?
        <div>
          <div className="messageTop">
            {!both ?
              !img ?
                <div className="messageTextbox">
                  <img
                    className="messageImg"
                    src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt=""
                  />
                  <p className="messageText">{message.text}</p>
                  <img className="msgImg" src={PF + message.image} />
                </div>
                :
                <div className="messageTextbox">
                  <img
                    className="messageImg"
                    src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt=""
                  />
                  <img className="msgImg" src={PF + message.image} />
                </div>
              :
              <div className="messageTextbox">
                <img
                  className="messageImg"
                  src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  alt=""
                />
                <p className="messageText">{message.text}</p>
              </div>
            }
          </div>

          <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
        :
        <div></div>
      }
    </div>
  );
}