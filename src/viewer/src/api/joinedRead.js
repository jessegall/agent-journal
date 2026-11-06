import {coalesced} from "../composables/coalesced.js";

function waitingRun() {
    const run = {askers: 0, stop: new AbortController()};
    run.answer = new Promise((resolve) => (run.resolve = resolve));
    return run;
}

// one read that many may ask for: one runs at a time and an asker joins it; once it is outdated by an event an asker waits for the
// one run that follows it instead, so an answer is never older than the event it was asked after
// a run is stopped only when every asker of it has gone, so a window that closes never cancels the read of another
export class JoinedRead {
    constructor(read, ended) {
        this.read = read;
        this.ended = ended;
        this.flying = null;
        this.following = null;
        this.outdated = false;
        this.ask = coalesced(() => this.leave(), 0);
    }

    leave() {
        const run = this.following;
        this.following = null;
        this.flying = run;
        this.outdated = false;
        const answer = this.read(run.stop.signal);
        run.resolve(answer);
        const landed = () => {
            if (this.flying === run) this.flying = null;
            if (!this.following) this.ended();
        };
        answer.then(landed, landed);
        return answer;
    }

    asked(signal) {
        const joining = this.flying && !this.outdated;
        const run = joining ? this.flying : (this.following ??= waitingRun());
        run.askers += 1;
        const answer = this.answerFor(run, signal);
        if (this.following === run) this.ask();
        return answer;
    }

    answerFor(run, signal) {
        if (!signal) return run.answer;
        return new Promise((resolve, reject) => {
            const gone = () => {
                this.left(run);
                reject(new DOMException("cancelled", "AbortError"));
            };
            if (signal.aborted) return gone();
            signal.addEventListener("abort", gone, {once: true});
            run.answer.then(resolve, reject).finally(() => signal.removeEventListener("abort", gone));
        });
    }

    left(run) {
        run.askers -= 1;
        if (run.askers > 0) return;
        run.stop.abort();
        if (run !== this.following) return;
        this.following = null;
        this.ask.cancel();
        if (!this.flying) this.ended();
    }

    heardEvent() {
        if (this.flying) this.outdated = true;
    }
}
