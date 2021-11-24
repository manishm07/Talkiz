import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import { useRef } from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";


export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user1, setUser] = useState({});
  const [page, setPage] = useState(false);
  const [btn, setBtn] = useState(false);
  const username = useParams().username;
  const status = useRef();
  const city = useRef();
  const country = useRef();
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [conversations, setConversations] = useState([]);


  const desc = useRef();

  const set = () => {
    setPage(true);
  }

  //unfriend action.......
  function handleUnfriend(e) {
    try {
      const res = axios.put(`http://localhost:8800/api/users/${e._id}/unfriend`,
        { userId: user._id });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    alert("you unfriend " + e.username);
    history.push("/FriendList");
  }

  //block friend action
  function handleBlock(e) {
    try {
      const res = axios.put(`http://localhost:8800/api/users/${e._id}/block`,
        { userId: user._id });
    } catch (err) {
      console.log(err);
    }
    try {
      const res = axios.put(`http://localhost:8800/api/users/${e._id}/unfriend`,
        { userId: user._id });
    } catch (err) {
      console.log(err);
    }
    alert("you have blocked " + e.username);
    history.push("/FriendList");
  }

  //handel message...........................
  function handleMessage(e) {

    if (conversations !== null) {
      if (conversations.match(e._id)) {
        history.push("/messenger");
      } else {
        try {
          const res = axios.post(`http://localhost:8800/api/conversations`,
            { senderId: user._id, receiverId: e._id });
          console.log(res._id);
          history.push("/messenger");
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      try {
        const res = axios.post(`http://localhost:8800/api/conversations`,
          { senderId: user._id, receiverId: e._id });
        console.log(res._id);
        history.push("/messenger");
      } catch (err) {
        console.log(err);
      }
    }
  }


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
      if (user._id === res.data._id) {
        setBtn(false);
      }
      else {
        setBtn(true);
      }
    };
    fetchUser();
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        if (res.data.length !== 0) {
          const convo = res.data[0].members;
          console.log(res.data);
          const friendId = convo.find((m) => m !== user._id);
          setConversations(friendId);
        }
        else {
          setConversations(null);
        }

      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [username, user1.city]);

  const save = async () => {
    const stat = status.current.value;
    const cityy = city.current.value;
    const countryy = country.current.value;
    //console.log(countryy);
    try {
      await axios.put(`/users/profile/${user1._id}`, {
        city: cityy,
        country: countryy,
        relationship: stat
      });

    } catch (err) {
      console.log(err);
    }
    setPage(false);
  }

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await axios.get(`/users?username=${username}`);
  //     setUser(res.data);
  //     console.log(res.data);
  //   };
  //   fetchUser();
  // }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user1.coverPicture
                    ? PF + user1.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user1.profilePicture
                    ? PF + "person/1.jpeg"
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user1.username}</h4>
              <span className="profileInfoDesc">{user1.desc}</span>
              {!page ?
                !btn ?
                 
                    <button className="editBtn" onClick={set}>
                      Edit Profile
                    </button>
                 
                  :
                  <div className="buttons">
                    <button onClick={() => handleUnfriend(user1)}>Unfriend</button>
                    <button onClick={() => handleMessage(user1)}>Message</button>
                    <button onClick={() => handleBlock(user1)}>Block</button>
                  </div>
                :
                null
              }
            </div>
          </div>
          <h4 className="rightbarTitle">User information</h4>
          {!page ?
            <div className="profileRightBottom">
              <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">City:</span>
                  <span className="rightbarInfoValue">{user1.city}</span>
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">country:</span>
                  <span className="rightbarInfoValue">{user1.country}</span>
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Relationship:</span>
                  <span className="rightbarInfoValue">
                    {user1.relationship === 2
                      ? "Single"
                      : user1.relationship === 1
                        ? "Married"
                        : "-"}
                  </span>
                </div>
              </div>
            </div>
            :
            <div className="profileRightBottom">
              <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">City:</span>
                  <input placeholder="City" ref={city} />
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Country:</span>
                  <input placeholder="Country" ref={country} />
                </div>
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Relationship:</span>
                  <select name="box" ref={status} className="select" isSearchable>
                    <option hidden>Select</option>
                    <option value='1'>Married</option>
                    <option value='2'>Single</option>
                  </select>
                </div>
                <button onClick={save}>Save</button>
              </div>

            </div>
          }

        </div>
      </div>
    </>
  );
}