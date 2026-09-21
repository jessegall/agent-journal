import {ref} from "vue";

const dragged = ref(null);

export function useCardDrag() {
    const start = (card) => (dragged.value = card);
    const end = () => (dragged.value = null);
    const takes = (lane) => !!dragged.value && dragged.value.targets.includes(lane);
    return {dragged, start, end, takes};
}
