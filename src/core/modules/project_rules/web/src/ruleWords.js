import {copying, deleteItem} from "@journal/window-kit";

// what the Rules page says about a rule, its filters and the items of its menu
export const STATE_WORDS = {proposed: "Waiting for you", active: "Active", denied: "Denied", removed: "Removed"};
const STATE_ORDER = Object.keys(STATE_WORDS);

export const ruleFilters = [
    {key: "state", label: "State", options: [["proposed", "Waiting"], ["active", "Active"], ["denied", "Denied"], ["removed", "Removed"]], get: (rule) => rule.state, default: ["proposed", "active"]},
];

// the list is grouped by state, the rules waiting for a user first
export const ruleItems = (rules) => [...rules].sort((one, two) => STATE_ORDER.indexOf(one.state) - STATE_ORDER.indexOf(two.state))
    .map((rule) => ({id: rule.id, title: rule.text, desc: "", group: STATE_WORDS[rule.state], row: rule}));

// the items of a rule's menu, the same in a right click on its row and in the Actions button of its reader. run(line, change) sends a journal line and answers {ok, error}
export function ruleMenu(rule, {run, remove, ask, open = null}) {
    const id = String(rule.id);
    const said = (line, done) => async ({say}) => {
        const answer = await run(line);
        say(answer.ok ? done : answer.error);
    };
    const live = rule.state === "active";
    return [
        ...(open ? [{label: "Open", group: "open", run: open}] : []),
        {label: "Copy text", group: "copy", run: ({say}) => copying(rule.text, "", say)},
        ...(rule.state === "proposed" ? [
            {label: "Approve", group: "own", run: said(["rule", "approve", id], `Rule ${id} approved`)},
            {label: "Decline", group: "own", run: said(["rule", "deny", id], `Rule ${id} declined`)},
        ] : []),
        ...(live ? [{label: "Edit", group: "own", run: ask}, deleteItem({word: "Remove", name: `rule ${id}`, remove})] : []),
    ];
}
