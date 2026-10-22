import {patched} from "../sync/rows.js";

// Takes a message down from above the chat: drawn undocked at once, and told to the journal through the scope's own address.
export function undock(scope, message) {
    patched(message, (row) => (row.data = {...row.data, docked: false}), () => scope.api.act("messages", message.id, "undock"));
}
