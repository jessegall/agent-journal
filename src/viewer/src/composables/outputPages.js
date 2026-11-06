import {nextTick, ref} from "vue";

const NEAR_THE_TOP = 60;

// the read of a page of output through a window's prop of it
export const readOutputProp = (window) => (words) => window.readKey(`output.${words[2]}`, words[3] ? {[words[3].slice(2)]: words[4]} : {});

// An output read a page at a time, never whole: the newest lines first, what is new on each follow, and an earlier page
// when the reader scrolls near the top. A file the runner cut starts again from its newest lines.
export function useOutputPages(read, processId) {
    const lines = ref([]);
    const firstByte = ref(0);
    let lastByte = -1;
    let cutBytes = 0;
    let reading = false;

    async function newest() {
        const answer = await read(["output", "page", String(processId())]);
        if (answer.ok) {
            lines.value = answer.value.lines;
            firstByte.value = answer.value.first_byte;
            lastByte = answer.value.last_byte;
            cutBytes = answer.value.cut_bytes;
        }
        return answer;
    }

    async function follow() {
        if (lastByte < 0) return newest();
        const answer = await read(["output", "page", String(processId()), "--after", String(lastByte)]);
        if (!answer.ok) return answer;
        if (answer.value.cut_bytes !== cutBytes || answer.value.total < lastByte) return newest();
        if (answer.value.lines.length) lines.value = [...lines.value, ...answer.value.lines];
        lastByte = answer.value.last_byte;
        return answer;
    }

    async function loadEarlier(box) {
        if (reading || firstByte.value <= 0 || box.scrollTop > NEAR_THE_TOP) return;
        reading = true;
        const height = box.scrollHeight;
        const answer = await read(["output", "page", String(processId()), "--before", String(firstByte.value)]);
        reading = false;
        if (!answer.ok) return;
        lines.value = [...answer.value.lines, ...lines.value];
        firstByte.value = answer.value.first_byte;
        await nextTick();
        box.scrollTop += box.scrollHeight - height;
    }

    return {lines, newest, follow, loadEarlier};
}
