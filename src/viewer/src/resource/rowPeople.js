import {creatorNameOf, ownerNameOf} from "../domain/resourceNouns.js";

// the name of the agent a row belongs to; "" when it cannot be read
export async function ownerFor(read, row) {
    const agent = await read(["agent", "show", String(row.agent_id)]);
    return agent.ok ? ownerNameOf(row, agent.value) : "";
}

// the name of whoever made a row: its actor, and its agent when the actor is one; "" when the actor cannot be read
export async function creatorFor(read, id) {
    const actor = await read(["actor", "show", String(id)]);
    const agent = actor.ok && actor.value.type === "agent" ? await read(["agent", "show", String(id)]) : {ok: false};
    return actor.ok ? creatorNameOf(actor.value, agent.ok ? agent.value : null) : "";
}
