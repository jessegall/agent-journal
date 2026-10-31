// What a verifier is doing, in words a person reads, by its state
export const VERIFIER_WORDS = {verifying: "Judging", judged: "Idle", "ended without a verdict": "Ended without a verdict"};

export const verifierName = (row) => `Verifier ${row.id}`;

export const verifierWord = (row) => VERIFIER_WORDS[row.state] || row.state;

// how many rows it judged, said as a person reads it
export const judgedLine = (row) => {
    const count = (row.judged || []).length;
    return count ? `Judged ${count} dismissal${count === 1 ? "" : "s"}` : "";
};
