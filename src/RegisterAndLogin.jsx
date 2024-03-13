import { useState } from "react";
import { authdatabase } from "./firebase_todapp_config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
  const history = useNavigate();

  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(authdatabase, provider)
      .then((result) => {
        
        console.log(result.user);
        history("/home");
      }).catch((error) => {

        console.log(error.message);
      });
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type === "signup") {
      createUserWithEmailAndPassword(authdatabase, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      signInWithEmailAndPassword(authdatabase, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home");
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };

  const handleReset = () => {
    history("/reset");
  };

  return (
    <>
      <header>
        <div className="head">
          <div className="imgContainer">
            <img className="header-img" src="/public/hovalogo.png" alt="Hova Logo" />
            <h4>Hova Notes</h4>
          </div>
        </div>
      </header>

      <div className="App">
        <div className="row">
          <div className={login === false ? "activeColor" : "pointer"} onClick={() => setLogin(false)}>
            SignUp
          </div>
          <div className={login === true ? "activeColor" : "pointer"} onClick={() => setLogin(true)}>
            SignIn
          </div>

          <div className="google" onClick={handleGoogleSignIn}>
            Sign in with Google
          </div>
     
        </div>
        <h1>{login ? "SignIn" : "SignUp"}</h1>
        <div className="regi-form">
        <form onSubmit={(e) => handleSubmit(e, login ? "signin" : "signup")}>
          <input name="email" placeholder="Email" />
          <br />
          <input name="password" type="password" placeholder="Password" />
          <br />
          <div className="forgot">
          <p onClick={handleReset}>Forgot Password?</p>
          <br />
          </div>
          
          <button className="up-in-btn">{login ? "SignIn" : "SignUp"}</button>
        </form>
        </div>
      </div>
    </>
  );
}

export default RegisterAndLogin;
