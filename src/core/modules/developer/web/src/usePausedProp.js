import {ref, watch} from "vue";

export function usePausedProp(window, key, paused, initial = null) {
    const feed = window.props[key];
    const data = ref(initial);
    const failure = ref("");
    function show() {
        if (paused.value) return;
        failure.value = feed.failure.value;
        if (feed.data.value !== undefined) data.value = feed.data.value;
    }
    watch([feed.data, feed.failure], show, {immediate: true});
    const reload = async () => {
        await window.reload(key);
        show();
    };
    return {data, failure, loaded: feed.loaded, reload};
}
