import { useContext, useEffect, useState } from "react";
import { AccountContext } from './Account'

function Status() {
    const [status, setStatus] = useState(false);

    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        getSession().then((session) => {
            console.log("Session: ", session);
            setStatus(true);
        })
    }, []);

    if (status) {
        return <div>
            Please log in
        </div>
    }
    return <div>
        <button onClick={logout}>Logout</button>
    </div>
}

export default Status;