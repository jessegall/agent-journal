import {rows} from "../sync/rows.js";

const card = (m) => m.data.card || {};

export const subagentsOf = (agent) =>
    rows("message")
        .filter((m) => card(m).kind === "subagent" && card(m).agent === agent)
        .map((m) => ({
            id: m.ref,
            at: m.created,
            task: card(m).detail,
            type: card(m).agent_type,
            model: card(m).model,
            session: card(m).subagent,
            status: card(m).state,
            running: card(m).state === "running",
        }));
