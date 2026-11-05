const moment = (value) => (typeof value === "number" ? value : Date.parse(value));

// a chat's messages and marks in one list in the order they happened, each tagged with what it is
export function interleaved(messages, marks) {
    const timed = (type, row) => ({type, id: `${type}:${row.id}`, row, time: moment(row.created_at) / 1000});
    const items = [...messages.map((row) => timed("message", row)), ...marks.map((row) => timed("mark", row))];
    return items.sort((a, b) => moment(a.row.created_at) - moment(b.row.created_at) || (a.type === b.type ? a.row.id - b.row.id : a.type === "message" ? -1 : 1));
}

// marks fold into one from three that stand together with nothing between them
const GROUP_FROM = 3;
const GROUP_KEYS = {
    family: (mark, declaration) => `family:${declaration.family}`,
    type: (mark) => `type:${mark.type}`,
    row: (mark) => (mark.target_model ? `row:${mark.target_model}:${mark.target_id}` : ""),
};

function groupKey(item, declarationOf) {
    if (item.type !== "mark") return "";
    const declaration = declarationOf(item.row.type);
    if (!declaration || declaration.process || declaration.card) return "";
    return GROUP_KEYS[declaration.grouping]?.(item.row, declaration) || "";
}

function markGroup(run, declarationOf) {
    const declaration = declarationOf(run[0].row.type);
    const label = declaration.group_label.replace("{count}", run.length).replace("{family}", declaration.family_title);
    return {type: "mark-group", id: `mark-group:${run[0].row.id}`, time: run[0].time, marks: run.map((item) => item.row), declaration, label};
}

// the list with each stretch of marks that belong together as one group, as their declarations say what they fold by
export function foldedMarks(items, declarationOf) {
    const folded = [];
    let run = [];
    let runKey = "";
    const close = () => {
        folded.push(...(run.length >= GROUP_FROM ? [markGroup(run, declarationOf)] : run));
        run = [];
    };
    for (const item of items) {
        const key = groupKey(item, declarationOf);
        if (key !== runKey) close();
        runKey = key;
        if (key) run.push(item);
        else folded.push(item);
    }
    close();
    return folded;
}
