import {ref} from "vue";

export function useUndoToast() {
    const toast = ref(null);
    const undo = () => toast.value?.action && (toast.value.action(), (toast.value = null));
    return {toast, undo};
}
