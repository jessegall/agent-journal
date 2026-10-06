import {ref} from "vue";
import {laneTitle} from "./lanes.js";

export function useBoardShift({send, move, refresh, refuse, notify}) {
    const moving = ref(0);

    async function shift(card, lane, words = {}) {
        moving.value = card.n;
        try {
            await send(card, lane, words);
            notify({text: `Moved #${card.n} to ${laneTitle(lane)}`, label: "Undo", action: () => move({...card, lane}, card.lane)});
        } catch (e) {
            refuse(e);
        } finally {
            await refresh();
            moving.value = 0;
        }
    }

    return {moving, shift};
}
