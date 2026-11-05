import {ref, watch} from "vue";
import {useWindow} from "./windowContextKey.js";

// the row a docked item points at, read whole with its kind's show line and again when a row of that kind changes
export function useDockRow(kind) {
    const context = useWindow();
    const item = context.option("row");
    const row = ref(null);

    async function load() {
        const answer = await context.read(`${kind} show ${item.value.target_id}`);
        row.value = answer.ok ? answer.value : null;
    }

    context.follow([`${kind}.*`], load);
    watch(() => item.value?.target_id, load, {immediate: true});
    return row;
}
