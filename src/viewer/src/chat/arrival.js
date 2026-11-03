export const PUSH_MS = 280;
export const FADE_MS = 240;
// how long the user's own message takes to fade in, there at its full size from the start
export const OWN_MS = 120;
const OWN_SLIDE_PX = 6;
const SLIDE_PX = 14;
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

// how far down from its place a row is drawn at this moment, read from the transform the browser works out
function slideOf(el) {
    const transform = getComputedStyle(el).transform;
    const matrix = /matrix\(([^)]+)\)/.exec(transform);
    if (matrix) return Number(matrix[1].split(",")[5]) || 0;
    return Number(/translateY\((-?[\d.]+)px\)/.exec(transform)?.[1]) || 0;
}

// Where the pane is held to show the foot of its content: a row sliding up from below lies past the end of the layout while it moves, and the scrollable
// area grows to hold it, so a pane held at the area's end rides that far too high and falls back when the row settles; the foot is taken as the layout has it.
function holdFoot(pane, el) {
    const slide = Math.max(0, slideOf(el));
    const area = pane.scrollHeight;
    if (!slide) return area - pane.clientHeight;
    const reach = el.getBoundingClientRect().bottom - pane.getBoundingClientRect().top - pane.clientTop + pane.scrollTop;
    const padding = Number.parseFloat(getComputedStyle(pane).paddingBottom) || 0;
    return (reach >= area - 1 ? Math.min(area, reach - slide + padding) : area) - pane.clientHeight;
}

// A turn that arrives while the reader follows the foot: the chat first glides up by the turn's height, the turn still unseen in the room
// being made (the pane held at its foot every frame), and only then the turn fades in and slides up from a little below into that room.
// A reader who is away sees nothing move: `done` is called at once. `frame` and `clock` are the page's own, given so a test can step them.
function arrive(el, {pane, follows, frame = requestAnimationFrame, clock = () => performance.now()}, done) {
    if (!pane || !follows()) return done();
    const height = el.offsetHeight;
    Object.assign(el.style, {boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${SLIDE_PX}px)`});
    void el.offsetHeight;
    el.style.transition = `height ${PUSH_MS}ms ${EASE}`;
    el.style.height = `${height}px`;
    const began = clock();
    let fading = false;
    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        Object.assign(el.style, {boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: ""});
        done();
    };
    const hold = () => {
        if (finished) return;
        if (follows()) pane.scrollTop = holdFoot(pane, el);
        const elapsed = clock() - began;
        if (!fading && elapsed >= PUSH_MS) {
            fading = true;
            el.style.transition = `opacity ${FADE_MS}ms ease-out, transform ${FADE_MS}ms ${EASE}`;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
        if (elapsed < PUSH_MS + FADE_MS) return frame(hold);
        finish();
    };
    frame(hold);
    return finish;
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
        if (follows()) pane.scrollTop = holdFoot(pane, el);
        if (clock() - began < OWN_MS) return frame(hold);
        Object.assign(el.style, {opacity: "", transform: "", transition: ""});
        done();
    };
    frame(hold);
}

// how long a message waits after the one before it has come in, when several arrive together
export const QUEUE_GAP_MS = 140;
export const DEPART_MS = 220;
// how many waiting turns come in together, so a long queue does not take long to show
export const BATCH_ROWS = 5;

// Turns that arrive together come in by batches: the first at once, then up to BATCH_ROWS together, a short gap after the batch before has finished, the
// ones still waiting held off the page (display none) so the chat stays where it is. A reader who is away gets every turn at once.
export function arrivalQueue({gap = QUEUE_GAP_MS, later = setTimeout} = {}) {
    const waiting = [];
    const active = new Set();
    let running = false;
    let timer = 0;
    let bulk = false;
    function start(item, finished) {
        active.add(item);
        item.cancel = item.arrival(item.el, item.options, () => {
            active.delete(item);
            item.done();
            finished();
        });
    }
    function next() {
        const batch = waiting.splice(0, BATCH_ROWS);
        running = batch.length > 0;
        if (!running) return;
        let left = batch.length;
        for (const item of batch) {
            item.el.style.display = item.display;
            start(item, () => {
                left -= 1;
                if (!left) timer = later(next, gap);
            });
        }
    }
    const enqueue = (el, options, done, arrival = arrive) => {
        if (bulk || !options.pane || !options.follows()) return done();
        const item = {el, options, done, arrival, display: el.style.display || ""};
        if (!running) {
            running = true;
            return start(item, () => (timer = later(next, gap)));
        }
        el.style.display = "none";
        waiting.push(item);
        if (waiting.length >= BATCH_ROWS) enqueue.flush();
    };
    // every turn still waiting is shown at once, as when the tab is hidden and nobody sees them come in
    enqueue.flush = () => {
        bulk = true;
        queueMicrotask(() => (bulk = false));
        for (const item of [...active]) item.cancel?.();
        clearTimeout(timer);
        running = false;
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

