import {computed, onUnmounted, ref, watch} from "vue";
import {useScope} from "./scope.js";

const FETCH_MS = 1000;

// The chat's messages with every live output card's view brought up to date: one request a second asks for all the
// outputs still running, and none is sent while no card is live.
export function useLiveOutputs(messages) {
    const scope = useScope();
    const views = ref({});
    const running = computed(() =>
        messages.value.filter((m) => m.data?.output && !m.data.ending && !views.value[m.data.output]?.ending).map((m) => m.data.output)
    );
    let timer = 0;
    const fetchViews = async () => {
        const fetched = await scope.api.outputProgress(running.value);
        views.value = {...views.value, ...fetched};
    };
    watch(
        () => running.value.length > 0,
        (live) => {
            clearInterval(timer);
            timer = live ? setInterval(fetchViews, FETCH_MS) : 0;
        },
        {immediate: true}
    );
    onUnmounted(() => clearInterval(timer));
    return computed(() =>
        messages.value.map((m) => {
            const view = m.data?.output && !m.data.ending ? views.value[m.data.output] : null;
            return view ? {...m, data: {...m.data, ...view}} : m;
        })
    );
}
