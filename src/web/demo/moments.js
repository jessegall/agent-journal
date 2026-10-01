const ROWS = "rows.";

function answered(ids, answers) {
    const moment = {rows: {}};
    Object.entries(ids).forEach(([name, id]) => {
        if (name.startsWith(ROWS)) moment.rows[name.slice(ROWS.length)] = answers[id].rows;
        else moment[name] = answers[id];
    });
    return moment;
}

const expanded = (moments, answers) => moments.map(({at, answers: ids}) => ({at, ...answered(ids, answers)}));

export function expand({answers, moments, branches = {}}) {
    return {
        moments: expanded(moments, answers),
        branches: Object.fromEntries(Object.entries(branches).map(([label, grown]) => [label, expanded(grown, answers)])),
    };
}
