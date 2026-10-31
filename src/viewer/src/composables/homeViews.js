import {feedOn, reviewerOn, workMode} from "./settings.js";
import {meta, tables} from "../domain/tables.js";
import {computed} from "vue";
import {open, recordCount, unreadByUser} from "../domain/records.js";
import {VIEWS} from "../domain/panes.js";

const OWN_TABS = ["questions"];

// the reviewer pane is Home's only while the reviewer is on, which is in orchestrator mode
export const reviewing = computed(() => workMode.value === "orchestrator" && reviewerOn.value);

export function useHomeViews() {
    const views = computed(() => ({
        chat: {title: "Chat", icon: "chat", all: {page: "messages", label: "View all messages"}},
        feed: {title: "File edits", icon: "edits", canFlush: true},
        terminal: {title: "Terminal", icon: "terminal"},
        agents: {title: "Agents", icon: "agents"},
        reviewer: {title: "Reviewer", icon: "reviewer"},
        side: {title: "Side thread", icon: "chat"},
        waiting: {
            title: "Notifications",
            icon: "bell",
            count: tables.value.filter((t) => t.needs_attention && !OWN_TABS.includes(t.name)).flatMap((t) => unreadByUser(t.name)).length,
            warm: true,
        },
        questions: {
            title: "Questions",
            icon: meta("questions").icon,
            count: open("questions").length,
            warm: true,
            all: {page: "questions", label: "View all questions"},
        },
        tasks: {
            title: "Tasks",
            icon: meta("tasks").icon,
            count: recordCount("tasks"),
            warm: false,
            all: {page: "tasks", label: "View all tasks"},
        },
        plans: {
            title: "Plans",
            icon: meta("plans").icon,
            count: recordCount("plans"),
            warm: false,
            all: {page: "plans", label: "View all plans"},
        },
    }));
    const usable = computed(() => VIEWS.filter((v) => (v !== "feed" || feedOn.value) && (v !== "reviewer" || reviewing.value)));
    return {views, usable};
}
