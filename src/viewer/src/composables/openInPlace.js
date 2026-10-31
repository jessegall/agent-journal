import {usePressedTurn} from "./pressedTurn.js";

// A turn the reader opens, a mark, a card or a bubble pressed or opened from the keyboard, opens in place: while it opens the chat
// neither follows the foot nor scrolls to show it, and once it has grown past the foot the reader is reading it, so nothing that
// settles later takes the chat down to the foot. `far` is how far past the foot that is, `reading` what makes the reader away.
export function useOpenInPlace(scroller, far, reading) {
    const pressedTurn = usePressedTurn();
    const OPENING_KEYS = ["Enter", " "];

    const keyed = (event) => OPENING_KEYS.includes(event.key) && pressedTurn.press(event);

    // the rows grew: true while a turn the reader opened is opening, which then decides alone what the chat does
    function grew() {
        if (!pressedTurn.isOpening()) return false;
        const s = scroller.value;
        if (s && s.scrollHeight - s.scrollTop - s.clientHeight > far) reading();
        return true;
    }

    return {press: pressedTurn.press, keyed, isOpening: pressedTurn.isOpening, grew};
}
