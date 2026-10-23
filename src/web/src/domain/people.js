// People named relative to the viewer: the viewer's own person is you, a colleague is called by name, and an agent by the
// person who owns its environment. `people` is what /journal/people answers: me, device, people and owners.

export const NOBODY = {me: 1, device: "", people: [], owners: {}};

export const personName = (number, people) => (people.people.find((person) => person.id === number) || {}).name || `user ${number}`;

export const isMe = (stamp, people = NOBODY) => stamp === `user:${people.me}`;

export function agentName(environmentId, people = NOBODY) {
    const owner = people.owners[String(environmentId)] || 0;
    return !owner || owner === people.me ? "the agent" : `${personName(owner, people)}'s agent`;
}

export function actorName(stamp, people = NOBODY, environmentId = 0) {
    const [kind, id] = (stamp || "system").split(":");
    if (kind === "user") return Number(id) === people.me ? "you" : personName(Number(id), people);
    if (kind === "agent") return agentName(environmentId, people);
    if (kind === "worker") return `worker ${id}`;
    if (kind === "phone") return "you, from your phone";
    return kind === "system" ? "the journal" : id || kind;
}

// The owner of an environment when that is not the viewer, else 0.
export function colleagueOwner(environmentId, people = NOBODY) {
    const owner = people.owners[String(environmentId)] || 0;
    return owner && owner !== people.me ? owner : 0;
}

// The environments the sidebar lists: the viewer's own and the Team chat, never a colleague's, which open from the Team page.
export const ownEnvironments = (rows, people = NOBODY) => rows.filter((row) => !colleagueOwner(row.id, people));
