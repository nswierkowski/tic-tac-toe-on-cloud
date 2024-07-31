import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import UserPool from './UserPool';

async function addTokenToLocalStorage(session) {
    const token = session.getAccessToken().getJwtToken();
    localStorage.setItem("token", token);
    console.log("TOKEN SETTED");
}

async function refreshSession(user, token) {
    const cognitoUser = new CognitoUser({
        Username: user.getUsername(),
        Pool: UserPool
    });

    cognitoUser.refreshSession(token, (err, session) => {
        if (err) {
            console.error('Refreshing session error:', err);
            return;
        }
        addTokenToLocalStorage(session);
    })
}

async function handleUserSession(user, session) {
    const token = session.getRefreshToken();

    if (!token) {
        console.error("Any token have not been found");
        return;
    }

    if (!session.isValid()) {
        refreshSession(user, token);
    }
}

async function tryRefreshSessionToken(){
    
    const user = UserPool.getCurrentUser();
    if (!user) {
        console.error("Current user not found");
        return;
    }

    user.getSession((err, session) => {
        if (err) {
            console.log("Getting user session error: ", err);
            return;
        }
        handleUserSession(user, session);
    })
}

async function refreshSessionToken() {
    try {
        tryRefreshSessionToken();
    } catch(err) {
        console.error("Refreshing token error: ", err);
    }
}

export default refreshSessionToken;