import {onBeforeUnmount, onMounted} from "vue";

const POLL_MILLISECONDS = 2000;

// reads again every two seconds while the run is going, once at the start too; the reading ends with the window
export function usePoll(load, running) {
    let timer = null;
    const poll = () => {
        timer = setTimeout(async () => {
            if (running()) await load();
            poll();
        }, POLL_MILLISECONDS);
    };
    onMounted(async () => {
        await load();
        poll();
    });
    onBeforeUnmount(() => clearTimeout(timer));
}
