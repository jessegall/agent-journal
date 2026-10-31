const OPENING_MS = 1500;

// The bubble the reader pressed: while it opens, as a chat mark or a card does on a click, the pane stays exactly where it is, neither
// following the foot nor scrolling to show the bubble, so the bubble opens in place under the reader's eyes.
export function usePressedTurn() {
    let pressed = null;
    let pressedAt = 0;

    function press(event) {
        pressed = event.target?.closest?.(".thread-turn") || null;
        pressedAt = Date.now();
    }

    function isOpening() {
        return Boolean(pressed && pressed.isConnected && Date.now() - pressedAt <= OPENING_MS);
    }

    return {press, isOpening};
}
