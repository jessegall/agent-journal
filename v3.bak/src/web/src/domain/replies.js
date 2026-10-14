export const IN_CHAT = /^(message|comment):/;

export const answered = (row) =>
    row.type === "message" && row.who === "user" ? (row.refs || []).find((ref) => IN_CHAT.test(ref)) || "" : "";

export const EARLIER = "An earlier message";
