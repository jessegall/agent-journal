import {ref} from "vue";

const steps = window.navigation;
export const canGoBack = ref(steps ? steps.canGoBack : true);
export const canGoForward = ref(steps ? steps.canGoForward : true);

steps?.addEventListener("currententrychange", () => {
    canGoBack.value = steps.canGoBack;
    canGoForward.value = steps.canGoForward;
});
