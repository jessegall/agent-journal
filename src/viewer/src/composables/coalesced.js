// a read asked for by events: it runs at once when the last run is older than `gap` milliseconds, and else once when the gap has passed, however many asked meanwhile
// while a read is in flight none starts beside it: one asked meanwhile runs after it has answered or failed
export function coalesced(read, gap, lastReadAt = 0) {
    let last = lastReadAt;
    let timer = null;
    let flying = false;
    let again = false;
    const answered = () => {
        flying = false;
        last = Date.now();
        if (!again) return;
        again = false;
        ask();
    };
    const run = () => {
        timer = null;
        const answer = read();
        last = Date.now();
        if (!(answer instanceof Promise)) return;
        flying = true;
        answer.catch(() => {}).finally(answered);
    };
    const ask = () => {
        if (flying) {
            again = true;
            return;
        }
        if (timer) return;
        const wait = gap - (Date.now() - last);
        if (wait <= 0) run();
        else timer = setTimeout(run, wait);
    };
    ask.cancel = () => {
        clearTimeout(timer);
        timer = null;
        again = false;
    };
    return ask;
}
