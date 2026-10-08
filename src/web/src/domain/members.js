export const ROLES = [
    {key: "writer", title: "Writer", tip: "Reads the journal and writes messages, to-dos, comments and documents"},
    {key: "reader", title: "Reader", tip: "Reads the journal and changes nothing in it"},
];

export const roleTitle = (key) => ROLES.find((role) => role.key === key)?.title || key;

export const memberStatus = (member) => (member.joined ? "Joined" : "Invited, has not joined yet");
