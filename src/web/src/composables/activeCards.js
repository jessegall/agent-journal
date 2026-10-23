import {computed, onUnmounted, ref, watch} from "vue";
import {useScope} from "./scope.js";
import {useColleague} from "./colleague.js";

const FETCH_MS = 1000;

// The chat's messages with every active process card brought up to date: one request a second asks for the fields each
// of them shows now, and none is sent while no process card is active. A colleague's outputs stay on their machine, so
// their cards are drawn from their messages alone.
export function useActiveCards(messages) {
    const scope = useScope();
    const {colleague} = useColleague();
    const views = ref({});
    const active = computed(() =>
        colleague.value ? [] : messages.value.filter((m) => m.data?.card_type === "process" && m.data.active && views.value[m.id]?.active !== false).map((m) => m.id)
    );
    let timer = 0;
    const fetchViews = async () => {
        const fetched = await scope.api.activeCards(active.value);
        views.value = {...views.value, ...fetched};
    };
    watch(
        () => active.value.length > 0,
        (live) => {
            clearInterval(timer);
            timer = live ? setInterval(fetchViews, FETCH_MS) : 0;
        },
        {immediate: true}
    );
    onUnmounted(() => clearInterval(timer));
    return computed(() =>
        messages.value.map((m) => {
            const view = m.data?.card_type === "process" && m.data.active ? views.value[m.id] : null;
            return view ? {...m, data: {...m.data, ...view}} : m;
        })
    );
}
