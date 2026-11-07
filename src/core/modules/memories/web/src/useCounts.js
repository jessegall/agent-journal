import {reactive, watchEffect} from "vue";
import {useWindow} from "@journal/window-kit";

export function useCounts() {
    const view = useWindow();
    const counts = reactive({main: 0, others: 0, everyone: 0});
    watchEffect(() => {
        const value = view.props.counts.data.value;
        if (value) Object.assign(counts, {main: value.main_count, others: value.agent_count, everyone: value.total});
    });
    return counts;
}
