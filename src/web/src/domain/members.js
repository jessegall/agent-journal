export const ROLES = [
    {key: "writer", label: "Writer", tip: "Reads the journal and writes messages, to-dos, comments and documents"},
    {key: "reader", label: "Reader", tip: "Reads the journal and changes nothing in it"},
];

export const roleTitle = (key) => ROLES.find((role) => role.key === key)?.label || key;

const DEPARTED = {left: "Left the journal", removed: "Removed by the owner"};

export function memberStatus(member) {
    if (member.departed) return DEPARTED[member.departed];
    if (member.joined === 0) return "Invited, has not joined yet";
    return member.connected ? "Connected now" : "Not connected";
}

export const OWNER = "owner";

export const FORMER_MEMBER = "A former member";

export const writerOf = (data, names) => {
    const member = data?.member;
    if (!member || member === OWNER) return null;
    return names[member] || FORMER_MEMBER;
};
