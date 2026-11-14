import {context} from "./windowContext.js";

export const workersWindowContext = (answers) => context(answers, null, {
    workers: {line: "agent list --role worker", tab: "workers", events: ["agent.*"]},
    recent: {line: "chat-mark main --type workers.worker", tab: "recent", events: ["chat_mark.*"], page_size: 50},
});
