import "./friendList.css";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../topbar/Topbar";
import { Add, Check } from "@material-ui/icons";


export default function FriendList() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [Sdata, setSData] = useState();
  const unamee = useRef();
  const [error, setError] = useState();
  const [page, setPage] = useState(false);
  const [btn, setBtn] = useState(false);
  const [nobutton, setNobutton] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
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




  const ProfileRightbar = () => {
    return (
      <div className="right-part">
        <h4 className="Title">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

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
    alert("Request Send");
    window.location.reload();
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
            <button className="search-Button" onClick={search}>Search</button>
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