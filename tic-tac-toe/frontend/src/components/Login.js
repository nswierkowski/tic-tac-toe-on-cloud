import React, { useState, useContext } from "react";
import UserPool from "./cognito/UserPool"
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js"
import {AccountContext} from './Account';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { authenticate } = useContext(AccountContext);

    const onSubmit = (event) => {
        event.preventDefault();

        // authenticate(email, password)
        // .then((data) => console.log("logged in!", data))
        // .catch((err) => {
        //     console.error("Failed to login ", err)
        // });

        new CognitoUser({
            Username: email,
            Pool: UserPool
        }).authenticateUser(new AuthenticationDetails({
            Username: email,
            Password: password
        }), {
            onSuccess: data => {
                console.log("Loged in!");
                localStorage.setItem("token", data.getAccessToken().getJwtToken());
                localStorage.setItem("refToken", data.getRefreshToken().getToken());
                window.location.reload();
            },
            onFailure: err => {
                console.error("Logging in failed: ", err)
            }
        })
    }

    return (
        <div>
            <label className="text-color">Log in to play a game!</label>
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
                    type="text" 
                    placeholder="Enter password"
                >
                </input>

                <button type="submit">Login</button>
            </form>
        </div>
    )
};

export default Login;