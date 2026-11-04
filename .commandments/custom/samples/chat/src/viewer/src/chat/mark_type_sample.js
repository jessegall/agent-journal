// @sin architecture_chat_mark_type_in_the_viewer
const THOUGHT = "messages.thought";

export const lookOf = (declarations, mark) =>
    // @righteous architecture_chat_mark_type_in_the_viewer
    declarations.find((declaration) => declaration.type === mark.type);

export {THOUGHT};
