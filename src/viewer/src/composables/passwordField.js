import {ref} from "vue";
import {strongPassword} from "../domain/passwords.js";

// a new password's field: what is typed, and a generated one shown in plain text so it can be saved
export function usePasswordField() {
    const password = ref("");
    const generated = ref(false);
    const generate = () => {
        password.value = strongPassword();
        generated.value = true;
    };
    return {password, generated, generate};
}
