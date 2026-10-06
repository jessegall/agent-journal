const ORDER = ["question", "plan", "report", "doc"];

export const waitingInOrder = (waiting) =>
    [...waiting].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type) || b.created - a.created);
