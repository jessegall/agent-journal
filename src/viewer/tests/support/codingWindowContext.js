import {context as baseContext} from "./windowContext.js";
import {ref} from "vue";

export {mounted, page, pickButton, settle, settleTransition} from "./windowContext.js";

export function context(answers, agent = null) {
    const base = baseContext(answers, agent);
    const state = {};
    const reports = ref([]);
    return {
        ...base,
        state,
        props: {reports: {rows: reports}},
        async reload(name) {
            if (name !== "reports") return;
            const answer = await base.read(`message agent-reports --agent ${state["reports.agent"]}`);
            if (answer.ok) reports.value = answer.value.rows;
        },
        sources: [
            {key: "waits", read: "worker waits", events: ["agent.*", "task.*", "proof.*", "worker_worktree.*"]},
            {key: "progress", read: "worker progress", events: ["task.*", "worker_worktree.*"]},
            {key: "queue", read: "proof list --limit 50", events: ["proof.*"]},
        ],
        links: {files: "coding.files"},
    };
}
