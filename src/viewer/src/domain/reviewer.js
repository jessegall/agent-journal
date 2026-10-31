import {holding, opened, placed, tabClosed} from "./panes.js";

// The reviewer pane on Home: the reviewer's steps, each review started, each test run, each point and its report,
// read from the own chats of the reviewers the journal sent, oldest first so the newest is at the bottom.
export const REVIEWER_VIEW = "reviewer";
const STEP = "review_step";

export const reviewSteps = (chats) =>
    chats
        .flatMap((chat) => chat.rows || [])
        .filter((row) => row.data && row.data.kind === STEP)
        .sort((a, b) => a.id - b.id);

// the reviewer pane placed beside the chat's pane, never in place of it; null when it is open already or there is no chat to put it beside
export function reviewerOpened(layout) {
    const chat = holding(layout, "chat");
    return opened(layout).has(REVIEWER_VIEW) || chat === null ? null : placed(layout, REVIEWER_VIEW, chat, "right");
}

// the reviewer pane taken out of the layout, once the reviewer is off; null when it is not docked
export function reviewerShut(layout) {
    const pane = holding(layout, REVIEWER_VIEW);
    return pane === null ? null : tabClosed(layout, pane, REVIEWER_VIEW);
}
