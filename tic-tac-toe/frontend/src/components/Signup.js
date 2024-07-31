import React, { useState } from "react";
import UserPool from "./cognito/UserPool"
import '../css/style.css'

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const onSubmit = (event) => {
        event.preventDefault();

        UserPool.signUp(email, password, [], null, (err, data) => {
            if (err) {
                console.error(err);
            } 
            console.log(data);

            const code = prompt('Your verification code: ', '');
            if (code) {
                data.user.confirmRegistration(code, false, (err, _) => {
                    if (err) {
                        alert(err.message)
                    }
                });
            }
        });
    }

    return (
        <div>
            <label className="text-color">Sign up to play a game!</label>
            <form onSubmit={onSubmit}>
                <input 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)}
                    type="text" 
                    placeholder="Enter email"
                >
                </input>
                <input 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)}
                    type="password" 
                    placeholder="Enter password"
                    >
                </input>

                <button type="submit">Sign up</button>
            </form>
        </div>
    )
};

export default Signup;