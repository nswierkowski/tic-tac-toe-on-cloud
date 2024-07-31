import { useState } from "react";
import Login from "./Login";

function DropDownLogin() {
    const [show, setShow] = useState(false);

    if (!show) {
        return <>
            <button onClick={() => {setShow(true)}}>Log in</button>
        </>
    }

    return <>
        <button onClick={() => {setShow(false)}}>Hide log in</button>
        <Login />
    </>
}

export default DropDownLogin;