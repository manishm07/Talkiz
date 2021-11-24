import Topbar from "../../components/topbar/Topbar";
import "./notification.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Check } from "@material-ui/icons";
import { useHistory } from "react-router";

export default function Notification() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [notification, setNotification] = useState([]);
  const [Sdata, setSData] = useState();
  const unamee = useRef();
  const [error, setError] = useState();
  const [page, setPage] = useState(false);
  const [btn, setBtn] = useState(false);
  const [nobutton, setNobutton] = useState(false);
  const { user } = useContext(AuthContext);
  const history = useHistory();

//button works...............
function  handleAccept(e){
  try{
    const res =  axios.put(`http://localhost:8800/api/users/${e._id}/acceptRequest`,
    { userId: user._id });
  console.log(res);
  }catch (err) {
    console.log(err);
  }
  try {
    const res =  axios.put(`http://localhost:8800/api/users/${e._id}/cancelRequest`,
      { userId: user._id });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
  alert("Accepted");
  window.location.reload();
  // history.push("/notification");
}
function handleReject (e){
  try {
    const res =  axios.put(`http://localhost:8800/api/users/${e._id}/cancelRequest`,
      { userId: user._id });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
  alert("Rejected");
  window.location.reload();
  // history.push("/notification");
}

  useEffect(() => {
    const getFriends = async () => {
      try {
        const notificationList = await axios.get("/users/notification/" + user._id);
        setNotification(notificationList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const search = async () => {
    const uname = unamee.current.value;
    var temp = null;
    if (uname.match(/.+@.+/)) {
      let data = JSON.stringify({
        "email": uname
      });
      try {

        const res = await axios.get('http://localhost:8800/api/users/search',
          { params: { data: data } });

        console.log(res);

        setSData(res.data);
        temp = res.data;
      } catch (err) {
        console.log(err);
      }
    } else {
      let data = JSON.stringify({
        "username": uname
      });
      try {

        const res = await axios.get('http://localhost:8800/api/users/search',
          { params: { data: data } });

        console.log(res);

        setSData(res.data);
        temp = res.data;
      } catch (err) {
        console.log(err);
      }
    }

    if (temp !== null) {
      if (user._id === temp._id) {
        setError("User Not Found");
      } else {
        if (temp.blocked.includes(user._id)) {
          setError("User Not Found");
        } else {
          if (temp.blockedBy.includes(user._id)) {
            setError("User Not Found");
          } else {
            if (temp.friends.includes(user._id)) {
              setPage(true);
              setNobutton(true);
            } else {
              if (temp.requestTo.includes(user._id)) {
                setPage(true);
                setNobutton(true);
              } else {
                if (temp.requestFrom.includes(user._id)) {
                  setBtn(true);
                  setPage(true);
                } else {
                  setPage(true);
                  setBtn(false);
                }
              }
            }
          }
        }
      }
    } else {
      setError("User Not Found");
    }
  }

  // button send Request
  const sendReq = async () => {
    try {
      const res = await axios.put(`/users/${user._id}/sendRequest`,
        { userId: Sdata._id });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setBtn(true);
  }

  //cancel request button
  const cancelReq = async () => {
    try {
      const res = await axios.put(`http://localhost:8800/api/users/${user._id}/cancelRequest`,
        { userId: Sdata._id });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setBtn(false);
  }

  const ProfileLeftbar = () => {
    return (
      <>
        <div className="profileLeft">
          <div class="search-container">
            <input type="text" placeholder="Search.." ref={unamee} />
            <button onClick={search}>Search</button>
          </div>
          {!page ?
            <div className="err-div">
              <label>{error}</label>
            </div>
            :
            <div className="profile-container">
              <Link
                to={"/profile/" + Sdata.username}
                style={{ textDecoration: "none" }}
              >
                <div className="rightbarFollowing">
                  <img
                    src={
                      Sdata.profilePicture
                        ? PF + Sdata.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">{Sdata.username}</span>
                </div>
              </Link>
              {!nobutton ?
                <div>
                  {!btn ?
                    <Add className="button-box" onClick={sendReq} />
                    :
                    <Check className="button-box" onClick={cancelReq} />
                  }
                </div>
                :
                <div></div>
              }
            </div>
          }
        </div>


      </>
    );
  };



  const ProfileRightbar = () => {
    return (
      <div className="rightContainer">
        <h4 className="Title">Friends Request</h4>
        <div className="rightbarNotifications">
          {notification.map((friend) => (
            <div className="bottonmarg">
              <div className="divseparate">
                <Link
                  to={"/profile/" + friend.username}
                  style={{ textDecoration: "none" }}
                >
                  <div className="rightbarPic">
                    <img
                      src={
                        friend.profilePicture
                          ? PF + friend.profilePicture
                          : PF + "person/noAvatar.png"
                      }
                      alt=""
                      className="rightbarImg"
                    />
                    <span className="rightbarFriendName">{friend.username}</span>
                  </div>
                </Link>
                <div className="rightTitleDiv">
                  <h4 className="rightTitle">Sent You A Friend Request.</h4>
                </div>
              </div>
              <div className="btndiv">
                <button className="btn" onClick={()=>handleAccept(friend)}>Accept</button>
                <button className="btn" onClick={()=>handleReject(friend)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <ProfileLeftbar />
        <ProfileRightbar />
      </div>
    </>
  );
}