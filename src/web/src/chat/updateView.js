import {markRaw, reactive} from "vue";

export const updateView = reactive({n: 0, from: null});

export function openUpdate(n, from) {
    updateView.from = markRaw(from);
    updateView.n = n;
}

export function closeUpdate() {
    updateView.n = 0;
    updateView.from = null;
}
