import {onUnmounted, ref, watch} from "vue";
import {route} from "../route.js";

const CHANNEL = "journal-environments";

export function useEnvironmentTab() {
    const tab = crypto.randomUUID();
    const taken = ref(false);
    const channel = new BroadcastChannel(CHANNEL);
    const claim = () => {
        taken.value = false;
        channel.postMessage({env: route.value.env, tab, origin: location.origin});
    };
    channel.onmessage = (e) => {
        const {env, origin} = e.data || {};
        if (e.data?.tab !== tab && env === route.value.env && origin === location.origin) taken.value = true;
    };
    watch(() => route.value.env, claim, {immediate: true});
    onUnmounted(() => channel.close());
    return {taken, claim};
}
