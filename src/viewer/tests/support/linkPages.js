const TABLES = {task: "tasks", plan: "plans", doc: "docs", report: "reports", message: "messages", agent: "agents"};

// the answer of `link receipts --messages <ids>`: for each message the named page and the sent page the same rows give
function receiptsPage(rows, words) {
    const ids = words[words.indexOf("--messages") + 1].split(",");
    const named = linkPage(rows, "link list --type about --type edited --group-counterparts").value;
    const sent = linkPage(rows, "link list --type sent_to").value;
    return {ok: true, value: {messages: Object.fromEntries(ids.map((id) => [id, {named, sent}]))}};
}

export function linkPage(rows, line) {
    const words = Array.isArray(line) ? line : line.split(" ");
    if (words.includes("receipts")) return receiptsPage(rows, words);
    const types = words.flatMap((word, at) => word === "--type" ? [words[at + 1]] : []);
    const filtered = rows.filter((row) => !types.length || types.includes(row.link_type));
    const resolved = filtered.map((row) => ({...row, target: row.target ?? {model: row.target_model, id: row.target_id,
        title: row.target_title ?? `${row.target_model} ${row.target_id}`, exists: true, unavailable: false,
        open_ref: `${TABLES[row.target_model]}:${row.target_id}`}}));
    const groups = new Map();
    for (const row of resolved) {
        const key = `${row.target_model}:${row.target_id}`;
        const group = groups.get(key) ?? {endpoint: row.target, relations: [], link_ids: []};
        group.relations = [...new Set([...group.relations, row.link_type])];
        group.link_ids.push(row.id);
        groups.set(key, group);
    }
    return {ok: true, value: {rows: resolved, counterparts: [...groups.values()], total: words.includes("--group-counterparts") ? groups.size : resolved.length, next_page: null}};
}
