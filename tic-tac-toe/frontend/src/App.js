import logo from './logo.svg';
import './App.css';
import TicTacToeGame from './components/socket_js.js';
import { Account } from './components/Account.js';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import DropDownComponent from './components/DropDownLogin.js';
import DropDownLogin from './components/DropDownLogin.js';
import DropDownSignup from './components/DropDownSignup.js';
import DropDownTicTacToe from './components/DropDownTicTacToe.js';
import Status from './components/Status.js';
import Logout from './components/Logout.js';


function App() {
  return (
    <div className="text-center" id="box">
      <header>
          <h1>Play Tic Tac Toe</h1>
      </header>
      <Account>
        <div className="log-sign-container">
          {/* <Status /> */}
          <Logout />
          <DropDownLogin />
          <DropDownSignup />
        </div>
      </Account>
      <DropDownTicTacToe />
    </div>
  );
}

export default App;
