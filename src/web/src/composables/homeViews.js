import {computed} from "vue";
import {open, unreadByUser} from "../domain/records.js";
import {VIEWS} from "../domain/panes.js";
import {feedOn, meta, types} from "../state/store.js";

const OWN_TABS = ["question", "suggestion"];

export function useHomeViews() {
    const views = computed(() => ({
        chat: {title: "Chat", icon: "chat"},
        feed: {title: "File feed", icon: "edits"},
        terminal: {title: "Terminal", icon: "terminal"},
        waiting: {
            title: "Notifications",
            icon: "bell",
            count: types.value.filter((t) => t.needs_attention && !OWN_TABS.includes(t.name)).flatMap((t) => unreadByUser(t.name)).length,
            warm: true,
        },
        question: {title: "Questions", icon: meta("question").icon, count: open("question").length, warm: true},
        suggestion: {title: "Suggestions", icon: meta("suggestion").icon, count: open("suggestion").length, warm: true},
        todos: {title: "To-dos", icon: meta("todo").icon, count: open("todo").length, warm: false},
    }));
    const usable = computed(() => VIEWS.filter((v) => v !== "feed" || feedOn.value));
    return {views, usable};
}
