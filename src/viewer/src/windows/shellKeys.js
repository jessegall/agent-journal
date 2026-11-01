const TYPING = "input,textarea,select,[contenteditable]";

// what a key does on the whole page, as version 4's did: Space opens the quick menu, Cmd or Ctrl and Shift and Enter switches full screen, Escape leaves it; a key used by something else, or typed in a field, does nothing
export function shellKeyAction(event, {wide = false, opened = false} = {}) {
    if (event.defaultPrevented || event.isComposing) return null;
    if (event.key === "Enter" && event.shiftKey && (event.metaKey || event.ctrlKey)) return "fullscreen";
    if (event.key === "Escape" && wide) return "leave-fullscreen";
    if (opened || event.target?.closest?.(TYPING)) return null;
    if (event.key === " " && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) return "quick-menu";
    return null;
}
