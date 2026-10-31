// What of the reader's hand moves the chat itself: a press on the chat's own scrollbar does, a press or a key anywhere else does
// not, and a wheel turned over a box inside the chat that can still scroll that way moves only that box.

// a press on the scrollbar of the pane, past the width its content takes
export const isScrollbarPress = (event, pane) => Boolean(pane) && event.target === pane && event.offsetX >= pane.clientWidth;

const SCROLLING = new Set(["auto", "scroll", "overlay"]);

const canScroll = (element, deltaY) => {
    if (element.scrollHeight <= element.clientHeight || !SCROLLING.has(getComputedStyle(element).overflowY)) return false;
    return deltaY < 0 ? element.scrollTop > 0 : element.scrollTop + element.clientHeight < element.scrollHeight;
};

// a wheel turned over a box between the target and the pane that scrolls in the wheel's direction moves that box, not the chat
export function wheelsInside(event, pane) {
    for (let element = event.target; element && element !== pane; element = element.parentElement) {
        if (canScroll(element, event.deltaY)) return true;
    }
    return false;
}
