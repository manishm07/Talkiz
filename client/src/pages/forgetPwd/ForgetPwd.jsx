
import { useContext, useRef, useState } from "react";
import "./forgetPwd.css"
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import firebase from "./../register/firebase";
import 'firebase/auth';
import { useHistory } from "react-router";

export default function ForgetPwd() {
    const email = useRef();
    const password = useRef();
    const repassword = useRef();
    const [eml, setEml] = useState();
    const { isFetching } = useContext(AuthContext);
    const [page, setPage] = useState(false);
    const history = useHistory();



    const handleClicked = async (e) => {
        e.preventDefault();
        const Password = password.current.value;
        const Repassword = repassword.current.value;
        if (Password === Repassword) {
            // alert("database push here");
            try {
                axios.put(`/users/updatePhone/${eml}`, {
                    password: Password,
                });
                alert("Password Changed !");
            } catch (err) {
                console.log(err);
            }
            history.push("/");
            window.location.reload();
        } else {
            alert("Password Didn't Matched");
        }
    }
    const handleClick = async (e) => {
        e.preventDefault();
        const Email = email.current.value;
        setEml(Email);
        var temp = null;
        if (Number(Email)) {
            // try{
            //    const res =  axios.get(`/users/userDetail/${Email}`);
            //    console.log(res);
            // }catch(err){
            //         console.log(err);
            // }
            const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', { 'size': 'invisible' });
            var number = '+977' + Email;
            firebase.auth().signInWithPhoneNumber(number, appVerifier)
                .then(function (e) {
                    //check otp.................
                    var code = prompt('Enter the otp', '');
                    //check otp null or not............
                    if (code === null)
                        return;
                    e.confirm(code).then(function (result) {
                        setPage(true);
                    });
                });
        } else {
            firebase.auth().sendPasswordResetEmail(Email)
                .then(() => {
                    alert("Email sent \nPlease reset Password");
                    history.push("/");
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error.code);
                    alert(error.code);
                });

        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                {!page ?
                    <div className="loginRight">
                        <form className="loginBox" onSubmit={handleClick}>
                            <input
                                placeholder="Enter Email or Phone"
                                required
                                className="loginInput-frgt"
                                ref={email}
                            />
                            <div id="recaptcha" />
                            <button className="loginButton" type="submit" disabled={isFetching}>
                                {isFetching ? (
                                    <CircularProgress color="white" size="20px" />
                                ) : (
                                    "Reset"
                                )}
                            </button>
                            <Link to="/login" style={{ textDecoration: "none" }}>
                                <span className="back-login">Back To Login</span>
                            </Link>
                        </form>
                    </div>
                    :
                    <div className="loginRight">
                        <form className="loginBox" onSubmit={handleClicked}>
                            <input
                                placeholder="Enter New Password"
                                required
                                className="loginInput-frgt"
                                ref={password}
                            />
                            <input
                                placeholder="Re-Enter Password"
                                required
                                className="loginInput-frgt"
                                ref={repassword}
                            />
                            <button className="loginButton" type="submit" disabled={isFetching}>
                                {isFetching ? (
                                    <CircularProgress color="white" size="20px" />
                                ) : (
                                    "Change Password"
                                )}
                            </button>
                            <Link to="/login" style={{ textDecoration: "none" }}>
                                <span className="back-login">Back To Login</span>
                            </Link>
                        </form>
                    </div>
                }
            </div>
        </div>
    );
}


