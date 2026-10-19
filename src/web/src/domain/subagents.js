import {refOf, seconds} from "./row.js";
import {rows} from "../sync/rows.js";

// The subagents an agent sent, from the cards the chat shows of them.
export const subagentsOf = (agent) =>
    rows("messages")
        .filter((m) => m.data?.kind === "subagent" && m.data.agent === agent)
        .map((m) => ({
            id: refOf(m),
            at: seconds(m.created_at),
            task: m.data.detail,
            type: m.data.agent_type,
            model: m.data.model,
            session: m.data.subagent,
            status: m.data.state,
            running: m.data.state === "running",
        }));
