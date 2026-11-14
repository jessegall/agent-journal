import {creatorNameOf, ownerNameOf} from "../domain/resourceNouns.js";

// the names of who made a row and which agent it belongs to, in one read; "" for a name that cannot be read
export async function peopleOf(read, row) {
    const creator = row.creator_id ? ["--creator", String(row.creator_id)] : [];
    const owner = row.agent_id ? ["--owner", String(row.agent_id)] : [];
    if (!creator.length && !owner.length) return {creator: "", owner: ""};
    const answer = await read(["agent", "people", ...creator, ...owner]);
    if (!answer.ok) return {creator: "", owner: ""};
    return {creator: creatorNameOf(answer.value.actor, answer.value.creator_agent), owner: owner.length ? ownerNameOf(row, answer.value.owner) : ""};
}
