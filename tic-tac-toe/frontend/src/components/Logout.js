import Pool from "./cognito/UserPool";
import "../css/style.css";

function Logout() {
    const logout = async (event) => {
        event.preventDefault();

        const user = Pool.getCurrentUser();
        console.log("Check is user loged in!")
        if (user) {
            console.log("Trying log out")
            user.signOut();
            localStorage.removeItem('token');
            localStorage.removeItem('refToken');
            window.location.reload();
        }
    };

    const isLoged = () => {
        return Pool.getCurrentUser();
    }

    if (isLoged()) {
        return <div className="log-sign-container">
            <label className="text-color">You are logged on!</label>
            <button onClick={logout}>Log out</button>
        </div>
    }

    return <label className="text-color">Log in to play!</label>
};

export default Logout;