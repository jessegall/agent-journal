export const refused = (card, meaning) => card.type === "ticket" && meaning === "start" && card.state === "draft";

export function moveEffect(card, meaning, slots) {
    if (card.type !== "ticket" || !meaning) return "";
    if (meaning === "review") return "waits for you";
    if (meaning === "done") return "closes once its branch is merged";
    if (refused(card, meaning)) return "confirm it first";
    return slots.running.length >= slots.limit ? "queues, every agent is busy" : "starts its agent";
}
