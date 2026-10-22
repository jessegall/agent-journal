// The notice of the restart an update needs: drawn as a dialog that cannot be dismissed, never among the pins.
export const RESTART_TONE = "restart";

export const restartNotice = (notices) => notices.find((n) => n.tone === RESTART_TONE) || null;

// The notices pinned above the chat: every open one but the restart, which has its own dialog.
export const pinnedNotices = (notices) => notices.filter((n) => n.tone !== RESTART_TONE);
