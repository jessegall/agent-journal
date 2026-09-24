import {onUnmounted} from "vue";

const CHANNEL = "journal-views";

export function openViewTab(env, view, id) {
    window.open(`${location.origin}/?view=${view}&float=${id}#/${env}`, `journal-view-${id}`);
}

export function listenViewTabs(handlers) {
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (e) => e.data && handlers[e.data.kind] && handlers[e.data.kind](e.data.id);
    return {recall: (id) => channel.postMessage({kind: "recall", id})};
}

export function useViewTab(id) {
    const channel = new BroadcastChannel(CHANNEL);
    const tell = (kind) => channel.postMessage({kind, id});
    channel.onmessage = (e) => e.data && e.data.kind === "recall" && e.data.id === id && window.close();
    const closed = () => tell("closed");
    window.addEventListener("pagehide", closed);
    onUnmounted(() => {
        window.removeEventListener("pagehide", closed);
        channel.close();
    });
    return {
        dock: () => {
            window.removeEventListener("pagehide", closed);
            tell("dock");
            window.close();
        },
    };
}
