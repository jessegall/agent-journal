// People named relative to the viewer: the viewer's own person is you, anyone else by name. `people` is what
// /journal/people answers: me and people.

export const NOBODY = {me: 1, people: []};

export const personName = (number, people) => (people.people.find((person) => person.id === number) || {}).name || `user ${number}`;

export const isMe = (stamp, people = NOBODY) => stamp === `user:${people.me}`;

export function actorName(stamp, people = NOBODY) {
    const [kind, id] = (stamp || "system").split(":");
    if (kind === "user") return Number(id) === people.me ? "you" : personName(Number(id), people);
    if (kind === "agent") return "the agent";
    if (kind === "worker") return `worker ${id}`;
    if (kind === "phone") return "you, from your phone";
    return kind === "system" ? "the journal" : id || kind;
}
