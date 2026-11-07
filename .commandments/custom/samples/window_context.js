function useWindow() { return {}; }
function other() { return {}; }

// @sin WindowContextNamedWindowDetector
const window = useWindow();
// @righteous WindowContextNamedWindowDetector
const view = useWindow();
// @righteous WindowContextNamedWindowDetector
const windowFromOther = other();

function read() {
    // @righteous WindowContextNamedWindowDetector
    const window = other();
    return window;
}
