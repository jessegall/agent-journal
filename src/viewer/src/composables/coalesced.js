// a read asked for by events: it runs at once when the last run is older than `gap` milliseconds, and else once when the gap has passed, however many asked meanwhile
export function coalesced(read, gap) {
    let last = 0;
    let timer = null;
    const run = () => {
        timer = null;
        last = Date.now();
        return read();
    };
    const ask = () => {
        if (timer) return;
        const wait = gap - (Date.now() - last);
        if (wait <= 0) run();
        else timer = setTimeout(run, wait);
    };
    ask.cancel = () => {
        clearTimeout(timer);
        timer = null;
    };
    return ask;
}
