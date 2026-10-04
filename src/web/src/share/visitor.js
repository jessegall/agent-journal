import {ref} from "vue";
import {remember, remembered} from "../composables/remembered.js";

export const NAME_KEY = "shared-comment-name";
export const visitorName = ref(remembered(NAME_KEY, ""));

export function rememberName(name) {
    visitorName.value = name;
    remember(NAME_KEY, name);
}
