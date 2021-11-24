import "./topbar.css";
import { logoutCall } from "../../apiCalls";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
//import DetailsIcon from '@material-ui/icons/Details';
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { Group } from "@material-ui/icons";
import { useRef } from "react";
//import {GroupsIcon} from '@mui/icons-material/Groups';


// import { createBrowserHistory } from 'history';
// export const history = createBrowserHistory();
export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);

  // const { user } = useContext(AuthContext);
  const history = useHistory();
  const out = () => {
    logoutCall(
      dispatch
    );

  };

  // const search = async () => {
  //   const uname = unamee.current.value;
  //   if (uname.match(/.+@.+/)) {
  //     let data = JSON.stringify({
  //       "email": uname
  //     });
  //     try {

  //       const res = await axios.get('http://localhost:8800/api/users/search',
  //         { params: { data: data } });

  //       console.log(res);

  //       setSData(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     let data = JSON.stringify({
  //       "username": uname
  //     });
  //     try {

  //       const res = await axios.get('http://localhost:8800/api/users/search',
  //         { params: { data: data } });

  //       console.log(res);

  //       setSData(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }


  // }


  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Talkiz</span>
        </Link>
      </div>
      <div className="topbarCenter">
        {/* <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend"
            className="searchInput"
          />
        </div> */}
        {/* <div class="topnav">
          <div class="search-container">
            <input type="text" placeholder="Search.." ref={unamee} />
            <button onClick={search}>Search</button>
            {console.log(Sdata)}
          </div>
        </div> */}


      </div>
      <div className="topbarRight">

        <div className="topbarIcons">
          <div className="topbarIconItem">

            <Link to='/FriendList' style={{ textDecoration: "none"}}>
              <Person />
            </Link>
          
          </div>
          <div className="topbarIconChatItem">

            <Link to={`/messenger/${user.username}`} style={{ textDecoration: "none" }}>
              <Chat />
            </Link>
          </div>
          <div className="topbarIconItem">
            <Link to={`/groupConversation`} style={{ textDecoration: "none" }}>
              < Group/>
            </Link>
           
          </div>

          <div className="topbarIconItem">
            <Link to={`/notification`} style={{ textDecoration: "none" }}>
              <Notifications />
            </Link>
       
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <DropdownButton id="dropdown-item-button" className="">
          <Dropdown.Item className="customD" as="button">
            <Link to="/setting" style={{ textDecoration: 'none' }}>Setting</Link>
          </Dropdown.Item>
          <Dropdown.Item className="customD" as="button">
            <Link to="/about" style={{ textDecoration: 'none' }}>About</Link>
          </Dropdown.Item>
          <Dropdown.Item className="customD" as="button" onClick={out}>
            <Link to="/login" style={{ cursor: 'pointer', textDecoration: 'none' }} >Signout</Link>
          </Dropdown.Item>
        </DropdownButton>
        {/* <div className="dropdown">
          <DetailsIcon style={{ height: 15, width: 20, textalign: 'left', cursor: 'pointer' }} className="dropbtn" />
          <div className="dropdown-content">
            <ul>
              <Link to="/setting"><li>Setting</li></Link>
              <Link to="/about" style={{ textDecoration: 'none' }}><li>About</li></Link>
              <Link to="/login"  style={{ cursor: 'pointer' }}>SignOut</Link>
              <li onClick={out}>sign out</li>
            </ul>
          </div>
        </div> */}
      </div>

    </div>
  );
}