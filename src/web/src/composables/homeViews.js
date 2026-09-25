import {computed} from "vue";
import {open, unreadByUser} from "../domain/records.js";
import {VIEWS} from "../domain/panes.js";
import {feedOn, meta, types} from "../state/store.js";

const OWN_TABS = ["question", "suggestion"];

export function useHomeViews() {
    const views = computed(() => ({
        chat: {title: "Chat", icon: "chat", all: {page: "message", label: "View all messages"}},
        feed: {title: "File feed", icon: "edits", canFlush: true},
        terminal: {title: "Terminal", icon: "terminal"},
        family: {title: "Agent family tree", icon: "family"},
        agents: {title: "Agents at work", icon: "agents"},
        waiting: {
            title: "Notifications",
            icon: "bell",
            count: types.value.filter((t) => t.needs_attention && !OWN_TABS.includes(t.name)).flatMap((t) => unreadByUser(t.name)).length,
            warm: true,
            all: {page: "notification", label: "View all notifications"},
        },
        question: {
            title: "Questions",
            icon: meta("question").icon,
            count: open("question").length,
            warm: true,
            all: {page: "question", label: "View all questions"},
        },
        suggestion: {
            title: "Suggestions",
            icon: meta("suggestion").icon,
            count: open("suggestion").length,
            warm: true,
            all: {page: "suggestion", label: "View all suggestions"},
        },
        todos: {
            title: "To-dos",
            icon: meta("todo").icon,
            count: open("todo").length,
            warm: false,
            all: {page: "todo", label: "View all to-dos"},
        },
    }));
    const usable = computed(() => VIEWS.filter((v) => v !== "feed" || feedOn.value));
    return {views, usable};
}
