const FRESH_MILLISECONDS = 5000;
const CANCELLED = "cancelled";
const held = new Map();

// the one read of `agent tip`, for every place an agent is hovered: whoever asks for an agent within a few seconds of the last
// read of it gets that answer, so moving over many rows of one agent reads it once; a read cut off by its window ending is asked again
export async function agentTipRead(context, agentId) {
    const key = `${context.environment}:${agentId}`;
    const last = held.get(key);
    if (last && performance.now() - last.at < FRESH_MILLISECONDS) {
        const answer = await last.answer;
        if (answer.failure !== CANCELLED) return answer;
        held.delete(key);
    }
    const answer = context.read(`agent tip ${agentId}`);
    held.set(key, {answer, at: performance.now()});
    return answer;
}
