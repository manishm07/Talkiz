import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import "./setting.css"
import { useRef, useContext, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from "../../context/AuthContext";
import { Form, Accordion, Button, Col, Row } from 'react-bootstrap';
import { logoutCall } from "../../apiCalls";
export default function Setting() {
  const email = useRef();
  const { user,dispatch } = useContext(AuthContext);
  const phone = useRef();
  const passwords = useRef();
  const newpasswords = useRef();
  const repasswords = useRef();
  const [userdata, setUserData] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/blocked/${user._id}`);
      setUserData(res.data);
      console.log(res.data);
    };
    fetchUser();
  }, [user]);

  //unblock function call

  function unBlock(e)  {
    
    //console.log(user._id);
    try {
       const res = axios.put(`/users/${e._id}/unblock`, {
        userId : user._id});
        window.location.reload();
        console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  const save = async () => {
    const email1 = email.current.value;
    const phone1 = phone.current.value;
    console.log(user._id);
    try {
      await axios.put(`/users/inUpdate/${user._id}`, {
        email: email1,
        phone: phone1
      });
    } catch (err) {
      console.log(err);
    }
  }

  const changed = async () => {
    const password = passwords.current.value;
    const newpassword = newpasswords.current.value;
    const repassword = repasswords.current.value;
    console.log(user._id);
    if (newpassword === repassword) {
      try {
        await axios.put(`/users/passUpdate/${user._id}`, {
          password: password,
          newpassword: newpassword
        });
      } catch (err) {
        console.log(err);
      }
      alert("Password Changed");
      logoutCall(
        dispatch
      );
    } else {
      alert("Password Didn't Matched");
    }
  }
  return (
    <>
      <Topbar />
      <Accordion defaultActiveKey="0" className="accodionManaual">
        <Accordion.Item eventKey="0">
          <Accordion.Header>General Settings</Accordion.Header>
          <Accordion.Body>
            <Form >
              <Form.Group as={Row} className="mb-3 justify-content-md-center" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col sm="6">
                  <Form.Control type="email" placeholder="email@example.com" ref={email} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3 justify-content-md-center" controlId="formPlaintextPhone">
                <Form.Label column sm="2">
                  Phone Number
                </Form.Label>
                <Col sm="6">
                  <Form.Control type="phone" placeholder="Phone" ref={phone} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Col sm="10">
                  <Button className="customButton" onClick={save}>Save</Button>{' '}
                </Col>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Security</Accordion.Header>
          <Accordion.Body>
            <Form>
              <Form.Group as={Row} className="mb-3 justify-content-md-center" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                  Old Password
                </Form.Label>
                <Col sm="6">
                  <Form.Control type="password" ref={passwords} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3 justify-content-md-center" controlId="formPlaintextNewPassword">
                <Form.Label column sm="2">
                  New Password
                </Form.Label>
                <Col sm="6">
                  <Form.Control type="Password" ref={newpasswords} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3 justify-content-md-center" controlId="formPlaintextConfirmNewPassword">
                <Form.Label column sm="2">
                  Confirm Password
                </Form.Label>
                <Col sm="6">
                  <Form.Control type="Password" ref={repasswords} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Col sm="10">
                  <Button className="customButton" onClick={changed}>Change Password</Button>
                </Col>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>Blocked Accounts</Accordion.Header>
          <Accordion.Body>
            {console.log(userdata)}
            {userdata.map((friend) => (
              <div className="Blockdiv">
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
                <div className="blockButtonDiv">
                  <button onClick={() => unBlock(friend)}>Unblock</button>
                </div>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}