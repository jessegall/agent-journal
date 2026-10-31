import {patched} from "../sync/rows.js";

// Takes a message down from above the chat: drawn undocked at once, and told to the journal through the scope's own address.
export function undock(scope, message) {
    patched(
        message,
        (row) => (row.data = {...row.data, docked: false}),
        () => scope.api.act("messages", message.id, "undock")
    );
}

// Pins a run's card above the chat: it no longer leaves when its run ends, only when the user closes it.
export function pinDock(scope, message) {
    patched(
        message,
        (row) => (row.data = {...row.data, pinned: true, undock_at: null}),
        () => scope.api.act("messages", message.id, "dock")
    );
}

// Unpins a run's card: it leaves a few seconds after its run ends, or then from now when the run has already ended.
export function unpinDock(scope, message) {
    patched(
        message,
        (row) => (row.data = {...row.data, pinned: false}),
        () => scope.api.act("messages", message.id, "unpin")
    );
}

// Holds a card that is leaving in place while the user points at it, in this viewer alone: its time to close waits
// until the pointer leaves, and then goes on for as long as it had left.
export function holdDock(message) {
    message.data = {...message.data, held_at: Date.now() / 1000};
}

export function releaseDock(message) {
    const {held_at: since, ...data} = message.data;
    message.data = {...data, undock_at: data.undock_at && data.undock_at + (Date.now() / 1000 - since)};
}
