import {onMounted, onUnmounted} from "vue";

const polls = new Map();

function run(key, held) {
    const round = async () => {
        if (polls.get(key) !== held) return;
        if (!document.hidden) {
            try {
                const got = await held.ask();
                held.takers.forEach((take) => take(got));
            } catch (e) {}
        }
        if (polls.get(key) === held) held.timer = setTimeout(round, held.every);
    };
    round();
}

export function usePoll(key, ask, every, take) {
    onMounted(() => {
        const held = polls.get(key);
        if (held) {
            held.takers.add(take);
            held.every = Math.min(held.every, every);
            return;
        }
        const fresh = {ask, every, takers: new Set([take]), timer: 0};
        polls.set(key, fresh);
        run(key, fresh);
    });
    onUnmounted(() => {
        const held = polls.get(key);
        if (!held) return;
        held.takers.delete(take);
        if (!held.takers.size) {
            clearTimeout(held.timer);
            polls.delete(key);
        }
    });
}
