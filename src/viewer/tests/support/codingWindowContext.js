import {context as baseContext} from "./agentWindowContext.js";

export {mounted, page, pickButton, settle, settleTransition} from "./windowContext.js";

export function context(answers, agent = null) {
    return {
        ...baseContext(answers, agent),
        sources: [
            {key: "waits", read: "worker waits", events: ["agent.*", "task.*", "proof.*", "worker_worktree.*"]},
            {key: "progress", read: "worker progress", events: ["task.*", "worker_worktree.*"]},
            {key: "queue", read: "proof list --limit 50", events: ["proof.*"]},
        ],
        links: {files: "coding.files"},
    };
}
