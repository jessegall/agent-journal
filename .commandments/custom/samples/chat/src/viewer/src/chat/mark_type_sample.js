// @sin architecture_chat_NoMarkTypeInViewerDetector
const THOUGHT = "messages.thought";

export const lookOf = (declarations, mark) =>
    // @righteous architecture_chat_NoMarkTypeInViewerDetector
    declarations.find((declaration) => declaration.type === mark.type);

export {THOUGHT};
