export const PUSH_MS = 280;
export const FADE_MS = 240;
// how long the user's own message takes to fade in, there at its full size from the start
export const OWN_MS = 120;
const OWN_SLIDE_PX = 6;
const SLIDE_PX = 14;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

// A turn that arrives while the reader follows the foot: the chat first glides up by the turn's height, the turn still unseen in the room
// being made (the pane held at its foot every frame), and only then the turn fades in and slides up from a little below into that room.
// A reader who is away sees nothing move: `done` is called at once. `frame` and `clock` are the page's own, given so a test can step them.
export function arrive(el, {pane, follows, frame = requestAnimationFrame, clock = () => performance.now()}, done) {
    if (!pane || !follows()) return done();
    const height = el.offsetHeight;
    Object.assign(el.style, {boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${SLIDE_PX}px)`});
    void el.offsetHeight;
    el.style.transition = `height ${PUSH_MS}ms ${EASE}`;
    el.style.height = `${height}px`;
    const began = clock();
    let fading = false;
    const hold = () => {
        if (follows()) pane.scrollTop = pane.scrollHeight;
        const elapsed = clock() - began;
        if (!fading && elapsed >= PUSH_MS) {
            fading = true;
            el.style.transition = `opacity ${FADE_MS}ms ease-out, transform ${FADE_MS}ms ${EASE}`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
        if (elapsed < PUSH_MS + FADE_MS) return frame(hold);
        Object.assign(el.style, {boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: ""});
        done();
    };
    frame(hold);
}

// The user's own message, just sent: it is there at once at its full size, so the user sees what they sent before the journal answers,
// fading in over a moment while the pane is held at its foot; `done` is called once it has.
export function arriveAtOnce(el, {pane, follows, frame = requestAnimationFrame, clock = () => performance.now()}, done) {
    if (!pane || !follows()) return done();
    Object.assign(el.style, {opacity: "0", transform: `translateY(${OWN_SLIDE_PX}px)`});
    void el.offsetHeight;
    el.style.transition = `opacity ${OWN_MS}ms ease-out, transform ${OWN_MS}ms ${EASE}`;
    Object.assign(el.style, {opacity: "1", transform: "translateY(0)"});
    const began = clock();
    const hold = () => {
        if (follows()) pane.scrollTop = pane.scrollHeight;
        if (clock() - began < OWN_MS) return frame(hold);
        Object.assign(el.style, {opacity: "", transform: "", transition: ""});
        done();
    };
    frame(hold);
}

// how long a message waits after the one before it has come in, when several arrive together
export const QUEUE_GAP_MS = 140;
export const DEPART_MS = 220;

// Turns that arrive together come in one after another: the first at once, each next a short gap after the one before it has finished, the
// ones still waiting held off the page (display none) so the chat stays where it is. A reader who is away gets every turn at once.
export function arrivalQueue({gap = QUEUE_GAP_MS, later = setTimeout} = {}) {
    const waiting = [];
    let running = false;
    const finish = (item) => {
        item.done();
        later(next, gap);
    };
    function next() {
        const item = waiting.shift();
        running = Boolean(item);
        if (!item) return;
        item.el.style.display = item.display;
        item.arrival(item.el, item.options, () => finish(item));
    }
    const enqueue = (el, options, done, arrival = arrive) => {
        if (!options.pane || !options.follows()) return done();
        const item = {el, options, done, arrival, display: el.style.display || ""};
        if (!running) {
            running = true;
            return arrival(el, options, () => finish(item));
        }
        el.style.display = "none";
        waiting.push(item);
    };
    // every turn still waiting is shown at once, as when the tab is hidden and nobody sees them come in
    enqueue.flush = () => {
        for (const item of waiting.splice(0)) {
            item.el.style.display = item.display;
            item.done();
        }
    };
    return enqueue;
}

// A turn that goes: its height closes while it fades, so the turns around it come together smoothly instead of jumping.
export function depart(el, done, later = setTimeout) {
    Object.assign(el.style, {boxSizing: "border-box", height: `${el.offsetHeight}px`, overflow: "hidden"});
    void el.offsetHeight;
    el.style.transition = `height ${DEPART_MS}ms ${EASE}, opacity ${DEPART_MS}ms ease-in, margin ${DEPART_MS}ms ${EASE}`;
    Object.assign(el.style, {height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px"});
    later(done, DEPART_MS);
}

// Something that joins a bubble, as the chips of a task made from it: the bubble's height opens to take it instead of jumping.
export function growHeight(el, done, later = setTimeout) {
    const height = el.scrollHeight;
    Object.assign(el.style, {boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0"});
    void el.offsetHeight;
    el.style.transition = `height ${PUSH_MS}ms ${EASE}, opacity ${FADE_MS}ms ease-out`;
    Object.assign(el.style, {height: `${height}px`, opacity: "1"});
    later(() => {
        Object.assign(el.style, {boxSizing: "", height: "", overflow: "", opacity: "", transition: ""});
        done();
    }, PUSH_MS);
}
