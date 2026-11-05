import {onBeforeUnmount, onMounted} from "vue";

const POLL_MILLISECONDS = 2000;

// reads again every two seconds, or every `milliseconds` (a number or a function giving one), while the run is going, once at the start too; the reading ends with the window
export function usePoll(load, running, milliseconds = POLL_MILLISECONDS) {
    let timer = null;
    let disposed = false;
    const poll = () => {
        if (disposed) return;
        timer = setTimeout(
            async () => {
                if (running()) await load();
                poll();
            },
            typeof milliseconds === "function" ? milliseconds() : milliseconds
        );
    };
    onMounted(async () => {
        await load();
        poll();
    });
    onBeforeUnmount(() => {
        disposed = true;
        clearTimeout(timer);
    });
}
