import { sendPasswordResetEmail } from "firebase/auth";
import { authdatabase } from "./firebase_todapp_config";
import { useNavigate } from "react-router-dom";
function ForgotPassword() {
    const history = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;
        sendPasswordResetEmail(authdatabase, emailVal)
            .then(() => {
                alert("Check your email for the password reset link.");
                history("/");
            })
            .catch(err => {
                alert(err.code);
            });
    }

    return (
        <div className="forget-app">
            <div className="regi-form">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" /><br/><br/>
                <button type="submit">Reset</button>
            </form>
            </div>
        </div>
    );
}
export default ForgotPassword;
