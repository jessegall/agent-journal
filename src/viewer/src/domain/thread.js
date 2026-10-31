export const EARLIER = "An earlier message";

// What a message answers: the message it is a reply to, as messages:12.
export const answered = (m) => (m.reply_target ? `messages:${m.reply_target}` : "");
