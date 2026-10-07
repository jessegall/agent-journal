import {api} from "../api/client.js";
import {offerUndo, speak} from "../state/suggestionScreen.js";

export const desktopActs = (open) => ({
    complete: (n, how) => api.answerSuggestion(n, how),
    install: (n) => api.installSuggested(n),
    installBlocked: () => "",
    noteWindow: (n) => api.noteSuggestionWindow(n),
    offerUndo: (n) => offerUndo(n, (one) => api.reopenSuggestion(one)),
    speak,
    open,
});
