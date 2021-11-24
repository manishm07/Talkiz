//import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import FriendList from "../src/components/friendList/FriendList"
import Setting from "./pages/setting/Setting";
import About from "./pages/about/About";
import Notification from "./pages/notification/Notification";
import GroupConversation from "./pages/groupConversation/Groupconversation";
import ForgetPwd from "./pages/forgetPwd/ForgetPwd";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
//import { Settings } from "@material-ui/icons";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Messenger /> : <Login />}
        </Route>
        <Route path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/" /> : <Messenger />}
        </Route>
        <Route path="/profile/:username">
        {!user ? <Redirect to="/" /> : <Profile/>}
        </Route>
        <Route path="/FriendList">
        {!user ? <Redirect to="/" /> : <FriendList />}
        </Route>
        <Route path="/setting">
        {!user ? <Redirect to="/" /> : <Setting />}
        </Route>
        {/* <Route path="/about">
        {!user ? <Redirect to="/" /> : <About />}
        </Route> */}
        <Route path="/notification">
        {!user ? <Redirect to="/" /> : <Notification />}
        </Route>
        <Route path="/groupConversation">
        {!user ? <Redirect to="/" /> : <GroupConversation />}
        </Route>
        <Route path="/forgetPassword">
        {user ? <Redirect to="/" /> : < ForgetPwd/>}
        </Route>
        
      </Switch>
    </Router>
  );
}

export default App;