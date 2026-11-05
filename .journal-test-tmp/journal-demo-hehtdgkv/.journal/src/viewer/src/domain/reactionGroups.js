// The faces the user can put on a message
export const FACES = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];

// a message's reactions, one entry per face with how many, whether the user put it on and who did
export function reactionGroups(text) {
    const groups = new Map();
    for (const reaction of JSON.parse(text || "[]")) {
        const group = groups.get(reaction.emoji) || {emoji: reaction.emoji, count: 0, mine: false, names: new Set()};
        group.count += 1;
        group.mine ||= reaction.actor_type === "user";
        group.names.add(reaction.actor_type === "user" ? "You" : "The agent");
        groups.set(reaction.emoji, group);
    }
    return [...groups.values()].map(({names, ...group}) => ({...group, title: [...names].join(" and ")}));
}
