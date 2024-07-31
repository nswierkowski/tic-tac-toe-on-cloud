import { useState } from "react";
import TicTacToeGame from "./socket_js";

function DropDownTicTacToe() {
    const [show, setShow] = useState(false);

    if (!show) {
        return <>
            <button onClick={() => {setShow(true)}}>Join game</button>
        </>
    }

    return <>
        <button onClick={() => {setShow(false)}}>Hide join game</button>
        <TicTacToeGame />
    </>
}

export default DropDownTicTacToe;