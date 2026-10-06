import {ref} from "vue";

const UNDER_AT = 44;

export function useScrolled() {
    const under = ref(false);
    const scrolled = (event) => (under.value = event.target.scrollTop > UNDER_AT);
    return {under, scrolled};
}
