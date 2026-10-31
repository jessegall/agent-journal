import {ref} from "vue";
import {toRaw} from "vue";
import {useScope} from "./scope.js";
import {pendingRow} from "../domain/placeholders.js";
import {refOf} from "../domain/row.js";
import {isQueued, onOutboxChange, sendMessage, token} from "../chat/outbox.js";
import {refresh} from "../sync/rows.js";
import {route} from "../route.js";
import {store} from "../state/store.js";

const pending = new Map();

function settle(id) {
    const row = pending.get(id);
    if (!row) return;
    pending.delete(id);
    store.rows.messages = (store.rows.messages || []).filter((r) => toRaw(r) !== row);
}

onOutboxChange((ids) => {
    if (ids.some((id) => pending.has(id))) refresh(["messages"]).finally(() => ids.forEach(settle));
});

// A comment the user writes on a row: shown at once, kept in the outbox until the server has it, and why it could not be saved.
export function useCommenting(resource) {
    const scope = useScope();
    const notSaved = ref("");

    function comment(text) {
        const on = refOf(resource());
        notSaved.value = "";
        const made = pendingRow("messages", {text, comments_on: [on]}, {author: "user"});
        const id = token();
        pending.set(id, made);
        store.rows.messages = [...(store.rows.messages || []), made];
        sendMessage(scope.env || route.value.env, {text, on}, [], id)
            .then(async ({delivered}) => {
                if (await delivered) return;
                if (!(await isQueued(id))) {
                    settle(id);
                    notSaved.value = "The comment was refused.";
                }
            })
            .catch((e) => {
                settle(id);
                notSaved.value = e.message;
            });
        return made;
    }

    return {notSaved, comment};
}
