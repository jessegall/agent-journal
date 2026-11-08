import {inject, onBeforeUnmount, onMounted, watch} from "vue";
import {WINDOW_CONTEXT} from "./windowContextKey.js";

const POLL_MILLISECONDS = 2000;

// reads again every two seconds, or every `milliseconds` (a number or a function giving one), while the run is going, once at the start too; the reading ends with the window
// a hidden tab, or a hidden pane or chat of the window it is drawn in, reads nothing, and reads once when it is shown again
// the next wait starts only once a read has answered, so a slow read gets no second one beside it; a read that fails breaks nothing and shows nothing: the poll tries again next time
export function usePoll(load, running, milliseconds = POLL_MILLISECONDS) {
    let timer = null;
    let disposed = false;
    let reading = false;
    let started = false;
    const view = inject(WINDOW_CONTEXT, null);
    const paneHidden = () => view?.visible?.value === false;
    const hidden = () => document.hidden || paneHidden();
    const guarded = async (step) => {
        reading = true;
        try {
            await step();
        } catch {
            // the next poll asks again
        } finally {
            reading = false;
        }
    };
    const read = () => guarded(async () => running() && (await load()));
    const poll = () => {
        if (disposed || hidden()) return;
        timer = setTimeout(
            async () => {
                if (!hidden()) await read();
                poll();
            },
            typeof milliseconds === "function" ? milliseconds() : milliseconds
        );
    };
    const begin = async () => {
        started = true;
        await guarded(load);
        poll();
    };
    const shown = async () => {
        if (disposed || hidden() || reading) return;
        clearTimeout(timer);
        if (!started) return begin();
        await read();
        poll();
    };
    watch(() => view?.visible?.value, shown);
    onMounted(async () => {
        document.addEventListener("visibilitychange", shown);
        if (!paneHidden()) await begin();
    });
    onBeforeUnmount(() => {
        disposed = true;
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", shown);
    });
}
