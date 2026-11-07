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

function assigned() {
    let window;
    // @sin WindowContextAssignedWindowDetector
    window = useWindow();
    return window;
}

function otherAssignment() {
    let window;
    // @righteous WindowContextAssignedWindowDetector
    window = other();
    return window;
}

function viewAssignment() {
    let view;
    // @righteous WindowContextAssignedWindowDetector
    view = useWindow();
    return view;
}

function propertyAssignment(holder) {
    // @righteous WindowContextAssignedWindowDetector
    holder.window = useWindow();
}
