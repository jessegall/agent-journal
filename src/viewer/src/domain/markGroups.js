// Chat marks folded as their declarations say: marks standing together with the same grouping key fold into one group mark from three of them

export const GROUP_FROM = 3;
// a run's later mark joins its group while the group is among this many of the chat's latest items; further back it starts a part of its own
const JOIN_WITHIN = 10;

const SAME_ROW = (mark) => (mark.target_model && mark.target_id ? `${mark.target_model}:${mark.target_id}` : "");
const KEYS = {
    family: (mark, declaration) => declaration.family,
    type: (mark) => mark.type,
    row: SAME_ROW,
    never: () => "",
};

// what a mark folds by: a worker's own marks fold by the worker before anything else, then its declared grouping
function foldKey(mark, declaration) {
    if (mark.agent_id) return `worker:${mark.agent_id}`;
    if (!declaration || declaration.grouping === "run") return "";
    const key = (KEYS[declaration.grouping] || KEYS.never)(mark, declaration);
    return key ? `${declaration.grouping}:${key}` : "";
}

// the words of a group: its declaration's group_label with {family}, {type} and {count} filled
export function groupWords(declaration, count) {
    return declaration.group_label.replace("{family}", declaration.family_title).replace("{type}", declaration.label).replace("{count}", String(count));
}

function groupItem(marks, declaration, words, extra = {}) {
    return {
        kind: "group",
        key: `group:${marks[0].id}`,
        marks,
        count: marks.length,
        label: words,
        buttons: declaration?.group_buttons || [],
        news: 0,
        continues: "",
        ...extra,
    };
}

const workerWords = (marks) => `Worker ${marks[0].agent_id}: ${marks.length} events`;
const single = (mark) => ({kind: "mark", key: `chat_mark:${mark.id}`, mark});

// a run's marks gather wherever they arrive, in step order, as version 4's gather did
function gather(out, units, mark) {
    const unit = units.get(mark.run_key);
    const at = unit ? out.indexOf(unit.place) : -1;
    if (unit && out.length - at <= JOIN_WITHIN) {
        if (at < out.length - 1) unit.news += 1;
        unit.marks.push(mark);
        return;
    }
    const place = {unit: {marks: [mark], news: 0, continues: unit ? unitKey(unit) : ""}};
    place.unit.place = place;
    units.set(mark.run_key, place.unit);
    out.push(place);
}

const unitShown = (unit) => Boolean(unit.continues) || unit.marks.length >= GROUP_FROM;
const unitKey = (unit) => (unitShown(unit) ? `group:${unit.marks[0].id}` : `chat_mark:${unit.marks[0].id}`);

function unitItems(unit, declarationOf) {
    const inOrder = [...unit.marks].sort((a, b) => a.run_step - b.run_step || a.id - b.id);
    if (!unitShown(unit)) return inOrder.map(single);
    const declaration = declarationOf(inOrder[0].type);
    const words = declaration ? groupWords(declaration, inOrder.length) : `${inOrder.length} updates`;
    return [groupItem(inOrder, declaration, unit.continues ? `${words}, continued` : words, {news: unit.news, continues: unit.continues})];
}

// marks in the order they stand: single marks and group marks. `declarationOf` finds a mark type's declaration.
export function groupMarks(marks, declarationOf) {
    const out = [];
    const units = new Map();
    let stretch = [];
    let stretchKey = "";
    const close = () => {
        if (stretch.length >= GROUP_FROM) {
            const declaration = declarationOf(stretch[0].type);
            const words = stretch[0].agent_id ? workerWords(stretch) : groupWords(declaration, stretch.length);
            out.push(groupItem(stretch, stretch[0].agent_id ? null : declaration, words));
        } else out.push(...stretch.map(single));
        stretch = [];
        stretchKey = "";
    };
    for (const mark of marks) {
        const declaration = declarationOf(mark.type);
        if (!mark.agent_id && declaration?.grouping === "run" && mark.run_key) {
            close();
            gather(out, units, mark);
            continue;
        }
        const key = foldKey(mark, declaration);
        if (!key || (stretch.length && stretchKey !== key)) close();
        if (key) {
            stretch.push(mark);
            stretchKey = key;
        } else out.push(single(mark));
    }
    close();
    return out.flatMap((item) => (item.unit ? unitItems(item.unit, declarationOf) : [item]));
}

// the marks of a group that came after the last one its reader saw when they opened it
export const newMarks = (group, seenId) => group.marks.filter((mark) => mark.id > seenId).length;
