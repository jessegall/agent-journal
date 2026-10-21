import {rows} from "../sync/rows.js";

// The subagents an agent sent, as their rows stand: running until they stop, and running again once resumed by a message.
export const subagentsOf = (agent) =>
    (agent ? rows("subagents").filter((s) => s.dispatcher === agent.session) : []).map((s) => ({
        id: `subagents:${s.id}`,
        time: s.resumed_at || s.started_at,
        ended: s.ended_at,
        task: s.task,
        type: s.agent_type,
        model: s.model,
        session: s.session,
        status: s.state,
        running: s.state === "running",
    }));
