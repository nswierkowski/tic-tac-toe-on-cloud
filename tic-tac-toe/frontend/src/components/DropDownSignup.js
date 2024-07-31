import { useState } from "react";
import Signup from "./Signup";

function DropDownSignup() {
    const [show, setShow] = useState(false);

    if (!show) {
        return <>
            <button onClick={() => {setShow(true)}}>Sign up</button>
        </>
    }

    return <>
        <button onClick={() => {setShow(false)}}>Hide sign up</button>
        <Signup />
    </>
}

export default DropDownSignup;