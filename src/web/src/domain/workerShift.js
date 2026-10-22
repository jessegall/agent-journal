// What a worker's task shows on its page: each point of the brief with its latest proof, and the words for a proof's state.
export const PROOF_WORDS = {
    shown: "Proved",
    "not done": "Not done",
    checked: "Checked",
    "checked, not done": "Checked, not done",
    short: "Sent back",
    stale: "Point rewritten",
};

const CHECKABLE = new Set(["shown", "not done"]);

export const isCheckable = (proof) => Boolean(proof) && CHECKABLE.has(proof.state);

export function pointRows(task) {
    const proofs = new Map((task.proofs || []).map((proof) => [proof.point, proof]));
    return (task.points || []).map((wording, i) => ({point: i + 1, wording, proof: proofs.get(i + 1) || null}));
}
