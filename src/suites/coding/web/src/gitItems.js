import {copying} from "@journal/window-kit";
import {checksLine, distanceLine, reviewLine, shortSha} from "./gitWords.js";

// the Git window's rows: each tab is a list of items {id, title, desc, group, row} read in a reader beside it. A commit is named by its subject and a branch by its name, and the
// menu has Open, Show changes (the Files page), a copy and, for a pull request, GitHub; never Duplicate and never Delete, as git is changed by the agents, not here
export const TABS = [{key: "commits", label: "Commits"}, {key: "branches", label: "Branches"}, {key: "pulls", label: "Pull requests"}];

export const commitItem = (commit) => ({id: commit.sha, title: commit.subject, desc: commit.author, group: "", kind: "commit", row: commit});
export const branchItem = (branch) => ({id: branch.name, title: branch.name, desc: distanceLine(branch), group: branch.current ? "Current" : "Other branches", kind: "branch", row: branch});
export const pullItem = (pull) => ({id: String(pull.number), title: `#${pull.number} ${pull.title}`, desc: `${pull.branch} by ${pull.author}`, group: "", kind: "pull", row: pull});

export const itemFields = {
    commits: [{key: "author", label: "Author", get: (item) => item.row.author}],
    branches: [{key: "current", label: "Kind", options: [["Current", "Current"], ["Other", "Other"]], get: (item) => (item.row.current ? "Current" : "Other")}],
    pulls: [{key: "review", label: "Review", get: (item) => reviewLine(item.row)}],
};

export const facts = (item) => {
    const row = item.row;
    if (item.kind === "commit") return [{name: "hash", label: "Hash", value: shortSha(row.sha)}, {name: "author", label: "Author", value: row.author}, {name: "at", label: "Committed", value: new Date(row.time * 1000).toISOString(), isTime: true}];
    if (item.kind === "branch") return [{name: "author", label: "Last commit by", value: row.author}, {name: "at", label: "Last commit", value: new Date(row.time * 1000).toISOString(), isTime: true}, {name: "distance", label: "Against the base", value: distanceLine(row)}, {name: "subject", label: "Last subject", value: row.subject}];
    return [{name: "branch", label: "Branch", value: row.branch}, {name: "author", label: "Author", value: row.author}, {name: "review", label: "Review", value: reviewLine(row)}, {name: "checks", label: "Checks", value: checksLine(row)}];
};

export function gitMenu(item, {open, showChanges}) {
    const row = item.row;
    return [
        ...(open ? [{label: "Open", group: "open", run: open}] : []),
        {label: "Show changes", group: "open", run: showChanges},
        ...(item.kind === "pull" ? [{label: "Open on GitHub", group: "open", run: () => window.open(row.url, "_blank", "noopener")}, {label: "Copy link", group: "copy", run: ({say}) => copying(row.url, "the link", say)}] : []),
        ...(item.kind === "commit" ? [{label: "Copy hash", group: "copy", run: ({say}) => copying(row.sha, "the hash", say)}] : []),
        ...(item.kind === "branch" ? [{label: "Copy name", group: "copy", run: ({say}) => copying(row.name, "the name", say)}] : []),
    ];
}
