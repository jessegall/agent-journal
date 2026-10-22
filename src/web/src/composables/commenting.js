import {ref} from "vue";
import {useScope} from "./scope.js";
import {pendingRow} from "../domain/placeholders.js";
import {refOf} from "../domain/row.js";
import {optimistic} from "../sync/rows.js";

// A comment the user writes on a row: shown at once, saved behind it, and why it could not be saved.
export function useCommenting(resource) {
    const scope = useScope();
    const notSaved = ref("");

    function comment(text) {
        const on = refOf(resource());
        notSaved.value = "";
        const made = pendingRow("comments", {text, on: [on]}, {author: "user"});
        optimistic("comments", made, () => scope.api.comment(on, text)).catch((e) => (notSaved.value = e.message));
        return made;
    }

    return {notSaved, comment};
}
