const ROWS = "rows.";

function answered(ids, answers) {
    const moment = {rows: {}};
    Object.entries(ids).forEach(([name, id]) => {
        if (name.startsWith(ROWS)) moment.rows[name.slice(ROWS.length)] = answers[id].rows;
        else moment[name] = answers[id];
    });
    return moment;
}

const notAfter = (rows, at) =>
    Object.fromEntries(
        Object.entries(rows).map(([type, held]) => [type, held.map((row) => (row.updated > at ? {...row, updated: at} : row))])
    );

function expanded(moments, answers) {
    return moments.map(({at, answers: ids}) => {
        const moment = answered(ids, answers);
        return {at, ...moment, rows: notAfter(moment.rows, at)};
    });
}

export function expand({answers, moments}) {
    return {moments: expanded(moments, answers)};
}
