import {copying} from "@journal/window-kit";

// The right-click menus of the Files page, each a list of items for the window kit's v-context: a tab, a row of the tree and a line of code.
const nameOf = (path) => path.split("/").pop();
const folderOf = (path) => path.split("/").slice(0, -1).join("/");
const noComments = (browser) => ({disabled: !browser.comments.available.value, reason: "No comments here"});

// what a tab adds to the editor tabs' own Close, Close others, Close to the right and Close all
export const tabItems = (browser, path) => [
    {label: "Copy path", group: "copy", run: ({say}) => copying(path, "the path", say)},
    {label: "Copy name", group: "copy", run: ({say}) => copying(nameOf(path), "the name", say)},
    {label: "Reveal in Files", group: "copy", run: () => browser.revealRow(path)},
    {label: "Comment on file", ...noComments(browser), run: () => browser.commentOn(path)},
];

// a row of the tree: a folder opens and folds, a file opens or shows its tab; both copy and search in their folder
export function rowItems(browser, row, gitAddress) {
    const path = row.id;
    const common = [
        {label: "Copy path", group: "copy", run: ({say}) => copying(path, "the path", say)},
        {label: "Copy name", group: "copy", run: ({say}) => copying(nameOf(path), "the name", say)},
        {label: "Search in this folder", group: "copy", run: () => browser.openPalette("files", `${row.folder ? path : folderOf(path)}/`.replace(/^\/$/, ""))},
    ];
    if (row.folder) return [{label: browser.opened.value.has(path) ? "Fold" : "Open", group: "open", run: () => browser.toggle(path)}, ...common];
    const tabbed = browser.tabs.value.includes(path);
    return [
        {label: tabbed ? "Show" : "Open", group: "open", run: () => browser.open(path)},
        ...(tabbed ? [{label: "Close", group: "open", run: () => browser.closeTab(path)}] : []),
        ...common,
        {label: "Comment on file", ...noComments(browser), run: () => browser.commentOn(path)},
        {label: "Show changes in Git", disabled: !row.git, reason: "No changes", run: () => (location.href = gitAddress())},
    ];
}

// a line of code: comment on it, copy it, copy where it is
export const lineItems = (browser, path, number, text) => [
    {label: "Comment on this line", group: "open", ...noComments(browser), run: () => browser.commentOn(path, number)},
    {label: "Copy line", group: "copy", run: ({say}) => copying(text.trim(), "the line", say)},
    {label: "Copy path and line", group: "copy", run: ({say}) => copying(`${path}:${number}`, "the path and line", say)},
];
