import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import firebase from "./firebase";
import 'firebase/auth';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [emailerror, setEmailError] = useState(null);
  // const tempo = useRef();


  // //select button for email and phone...............................
  // const OnChange = (e) => {
  //   setVal(tempo.current.value);
  // };


  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    const temppass = password.current.value;
    const userName = username.current.value;
    const Email = email.current.value;
    var temp = null;

    try {
      const res = await axios.get("/auth/search/" + userName);
      temp = res.data;
    } catch (err) {
      console.log(err);
    }

    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      if (temp === true) {
        setError("Username Already Exist!");
      } else {
        //email format  check...........
        if (Number(Email)) {
          //number length check..........
          if (Email.length === 10) {
            //number verification method..............................
            const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', { 'size': 'invisible' });
            var number = '+977' + Email;
            firebase.auth().signInWithPhoneNumber(number, appVerifier)
              .then(function (e) {
                //check otp.................
                var code = prompt('Enter the otp', '');
                //check otp null or not............
                if (code === null)
                  return;
                //match otp..................
                e.confirm(code).then(function (result) {
                  const uid = result.user.uid;
                  //send data in database from here....................................... 
                  const user1 = {
                    username: username.current.value,
                    email:"",
                    phone: email.current.value,
                    password: password.current.value,
                    verified: '1',
                  };
                  try {
                    axios.post("/auth/number", user1);
                    history.push("/login");
                  } catch (err) {
                    console.log(err);
                  }

                  alert("Account Created");
                  window.location.reload();
                }).catch(function (error) {
                  //its catch of conform otp
                  console.error(error.code);
                  alert(error.code);
                  window.location.reload();
                });
              })
              .catch(function (error) {
                //its catch of otp send...............
                console.log(error.code);
                alert(error.code);
              });

          } else {
            setEmailError("Invalid Number!");
          }
        } else {
          if (Email.match("@")) {
            if (Email.includes(".")) {
              //firebase auth for email....................
              firebase.auth().createUserWithEmailAndPassword(Email, temppass)
                .then((user) => {
                  // send verification mail.
                  user.user.sendEmailVerification()
                  //set value in database............................
                   //insert data in database here
                const user1 = {
                  username: username.current.value,
                  email: email.current.value,
                  password: password.current.value,
                  verified: '2',//changed..................................
                };
                try {
                  axios.post("/auth/register", user1);
                  history.push("/login");
                } catch (err) {
                  console.log(err);
                }
                  alert("Email sent");
                  window.location.reload();
                }).catch(function (error) {
                  //if email already used................
                  console.log(error.message);
                  //check verification....................
                  firebase.auth().onAuthStateChanged((user) => {
                    console.log(user.emailVerified);
                    if (user.emailVerified) {
                      console.log('email is verified')
                      try {
                        axios.put("/auth/verify", {
                          email: Email,
                          verified: '1',
                        });
                      } catch (err) {
                        console.log(err);
                      }
                      alert("Email Already Used !");
                    } else {
                      console.log('email not verified')
                      user.sendEmailVerification();
                      alert("Email Already Used !");
                      console.log(user);
                    }
                  });
                });
            } else {
              setEmailError("Invalid Email!");
            }
          } else {
            setEmailError("Invalid Email!");
          }
        }
      }


   
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <h4>{error}</h4>
            {/* <select ref={tempo} onChange={OnChange} className="loginInput" isSearchable >
              <option hidden>Select Verification Mode</option>
              <option value='Email'>Email</option>
              <option value='Phone'>Phone Number</option>
            </select> */}
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
            />
            <h4>{emailerror}</h4>
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type="password"
            />
            <div id="recaptcha" />
            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <span className="loginRegisterButton">Log into Account</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}