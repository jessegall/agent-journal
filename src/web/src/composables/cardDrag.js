import {computed} from "vue";
import {ui} from "../state/ui.js";

const dragged = computed(() => ui.dragged);

export function useCardDrag() {
    const start = (card) => (ui.dragged = card);
    const end = () => (ui.dragged = null);
    const takes = (lane) => !!ui.dragged && ui.dragged.targets.includes(lane);
    return {dragged, start, end, takes};
}
