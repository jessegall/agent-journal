export const refused = (card, meaning) => card.type === "ticket" && meaning === "start" && card.state === "draft";

const SHIFT_QUESTIONS = {
    held: {title: "Why is it held?", word: "why", required: true},
    done: {title: "How did it land?", word: "how", required: false},
    todo: {title: "Why reopen it?", word: "why", required: true},
};

export const shiftQuestion = (card, lane) =>
    card.type === "todo" && (lane !== "todo" || card.lane === "done") ? SHIFT_QUESTIONS[lane] || null : null;

export function moveEffect(card, meaning, slots) {
    if (card.type !== "ticket" || !meaning) return "";
    if (meaning === "review") return "waits for you";
    if (meaning === "done") return "closes once its branch is merged";
    if (refused(card, meaning)) return "confirm it first";
    return slots.running.length >= slots.limit ? "queues, every agent is busy" : "starts its agent";
}
