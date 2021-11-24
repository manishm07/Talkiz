import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import firebase from "./../register/firebase";
import 'firebase/auth';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    const Email = email.current.value;
    const Pass = password.current.value;
    var temp = null;
    var datacopy = null;

    if (Number(Email)) {
      loginCall(
        { phone: email.current.value, password: password.current.value },
        dispatch
      );
      
    } else {
      //for email and password validation......................
      try {
        const res = await axios.post("/auth/login", {
          email: Email,
          password: Pass,
        });
        temp = false;
        datacopy = res.data;
      } catch (err) {
        console.log(err);
        temp = true;
      }
      if (temp) {
        firebase.auth().signInWithEmailAndPassword(Email, Pass)
          .then((user) => {
            //password update.........
            try {
              axios.put(`/users/logpassUpdate/${Email}`, {
                password: Pass,
              });
            } catch (err) {
              console.log(err);
            }
            // loginCall(
            //       { email: email.current.value, password: password.current.value },
            //       dispatch
            //     );
            //check verification to be edit....................
            if (user.user.emailVerified) {
              console.log('email is verified');
              try {
                axios.put("/auth/verify", {
                  email: Email,
                  verified: '1',
                });
              } catch (err) {
                console.log(err);
              }
              loginCall(
                { email: email.current.value, password: password.current.value },
                dispatch
              );
            } else {
              user.user.sendEmailVerification()
              alert("Email sent \nPlease Verify Your Email First");
            }

          }).catch((error) => {
            console.log(error);
            alert("Wrong Username And Password");
          });
        firebase.auth().signOut().then(() => {
        }).catch((error) => {
          console.log(error);
        });
      } else {
        console.log(datacopy.verified);
        if (datacopy.verified === 1) {
           loginCall(
          { email: email.current.value, password: password.current.value },
          dispatch
        );
        } else {
          console.log("unverified");
          firebase.auth().signInWithEmailAndPassword(Email, Pass)
          .then((user) => {
            // loginCall(
            //       { email: email.current.value, password: password.current.value },
            //       dispatch
            //     );
            //check verification to be edit....................
            if (user.user.emailVerified) {
              console.log('email is verified');
              try {
                axios.put("/auth/verify", {
                  email: Email,
                  verified: '1',
                });
              } catch (err) {
                console.log(err);
              }
              loginCall(
                { email: email.current.value, password: password.current.value },
                dispatch
              );
            } else {
              user.user.sendEmailVerification()
              alert("Email sent \nPlease Verify Your Email First");
            }

          }).catch((error) => {
            console.log(error);
          });
        firebase.auth().signOut().then(() => {
        }).catch((error) => {
          console.log(error);
        });


        //   firebase.auth().signInWithEmailAndPassword(Email, Pass)
        //   .then((user) => {
        //       user.user.sendEmailVerification()
        //       alert("Email sent \nPlease Verify Your Email First");

        //   }).catch((error) => {
        //     console.log(error);
        //   });
        // firebase.auth().signOut().then(() => {
        // }).catch((error) => {
        //   console.log(error);
        // });
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
              placeholder="Email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <Link to="/forgetPassword" style={{ textDecoration: "none" }}>
            <span className="loginForgot">Forgot Password?</span>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <span className="loginRegisterButton">Create a New Account</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}