import {ref} from "vue";

// the one row of a list shown open: a click on a row opens it, a second click on it closes it
export function useOpenRow() {
    const opened = ref(null);
    const toggle = (row) => {
        opened.value = opened.value === row.id ? null : row.id;
    };
    return {opened, toggle};
}
