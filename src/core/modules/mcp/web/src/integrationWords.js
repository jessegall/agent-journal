import {copying} from "@journal/window-kit";

// the words of the Integrations page. Every card has the same lines in the same places: the name, the tool count (a dash when it is not known, for a suggested server why it is suggested),
// the command or address, the notice when it failed, and the foot. A connected server has no badge: a normal state is not a box.
export const CONNECTED = "Connected";
export const FAILED = "Failed";
export const SUGGESTED = "Suggested";
export const INSTALLED = "Installed";
export const integrationFields = [{key: "status", label: "State", options: [[CONNECTED, CONNECTED], [FAILED, FAILED]], get: (item) => item.status}];

const address = (row) => row.url || [row.command, ...row.args].join(" ");
// what the check says is wrong with a server, without its name and without the command that mends it
const reasonOf = (line) => (line ?? "").replace(/:\s*journal .*$/, "");
const isFailed = (row, line) => row.readiness === "needs its key" || /^(needs|missing)/.test(line ?? "");

export function installedCard(row, line) {
    const failed = isFailed(row, line);
    return {
        id: row.id,
        title: row.title,
        icon: "plug",
        state: "Tools: —",
        status: failed ? FAILED : CONNECTED,
        line: address(row),
        fault: failed ? `Failed to connect · ${reasonOf(line) || row.readiness}` : "",
        group: INSTALLED,
        row,
    };
}

export const suggestedCard = (row) => ({id: `suggested-${row.id}`, title: row.title, icon: "plug", state: row.subject, status: SUGGESTED, line: "Not installed", fault: "", group: SUGGESTED, row});

export const keyFields = (row) => [{key: "key", label: row.key_variable, kind: "password", required: true, placeholder: "Paste the key"}];
export const keyLine = (row, values) => ["mcp", "key", row.name, values.key.trim()];
export const keyCommand = (row) => () => `journal mcp key ${row.name} …`;

export const newFields = [{key: "name", label: "Name", required: true, placeholder: "shop"}, {key: "target", label: "Address or command", required: true, placeholder: "https://example.com/mcp, or npx -y shop"}];
export const newLine = (values) => ["mcp", "add", values.name.trim(), values.target.trim()];
export const newCommand = (values) => `journal mcp add ${values.name.trim() || "…"} ${values.target.trim() || "…"}`;

// Check, Sign in when it signs in on its own, Secret when it has a key, Copy address and Remove, which asks once more in place
export function serverMenu(item, {check, signIn, secret, remove}) {
    const row = item.row;
    return [
        {label: "Check", group: "open", run: check},
        ...(row.auth === "oauth" ? [{label: "Sign in", group: "open", run: signIn}] : []),
        ...(row.key_variable ? [{label: "Secret", group: "own", run: secret}] : []),
        {label: "Copy address", group: "copy", run: ({say}) => copying(item.line, "the address", say)},
        {label: "Remove", group: "delete", danger: true, armedLabel: "Remove: click again", run: remove},
    ];
}
