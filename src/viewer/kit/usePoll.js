import {onBeforeUnmount, onMounted} from "vue";

const POLL_MILLISECONDS = 2000;

// reads again every two seconds, or every `milliseconds` (a number or a function giving one), while the run is going, once at the start too; the reading ends with the window
// a hidden tab reads nothing, and reads once when it is shown again
// the next wait starts only once a read has answered, so a slow read gets no second one beside it; a read that fails breaks nothing and shows nothing: the poll tries again next time
export function usePoll(load, running, milliseconds = POLL_MILLISECONDS) {
    let timer = null;
    let disposed = false;
    let reading = false;
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
        if (disposed || document.hidden) return;
        timer = setTimeout(
            async () => {
                if (!document.hidden) await read();
                poll();
            },
            typeof milliseconds === "function" ? milliseconds() : milliseconds
        );
    };
    const shown = async () => {
        if (disposed || document.hidden || reading) return;
        clearTimeout(timer);
        await read();
        poll();
    };
    onMounted(async () => {
        document.addEventListener("visibilitychange", shown);
        await guarded(load);
        poll();
    });
    onBeforeUnmount(() => {
        disposed = true;
        clearTimeout(timer);
        document.removeEventListener("visibilitychange", shown);
    });
}
