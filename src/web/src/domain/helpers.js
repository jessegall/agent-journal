export const helperState = (row) => (row.completed ? "finished" : row.data?.report ? "reported" : "running");

export const HELPER_WORDS = {running: "Running", reported: "Reported", finished: "Finished"};

export const helperLine = (row) => [row.data?.provider, row.data?.model].filter(Boolean).join(" · ");

export function helpersInOrder(rows, keepFinished = 5) {
    const open = rows.filter((row) => helperState(row) !== "finished");
    const done = rows
        .filter((row) => helperState(row) === "finished")
        .slice(-keepFinished)
        .reverse();
    return [...open.filter((row) => helperState(row) === "running"), ...open.filter((row) => helperState(row) === "reported"), ...done];
}

export const helperView = (row) => ({
    row,
    n: row.n,
    name: row.data?.name || `Helper ${row.n}`,
    title: row.title,
    line: helperLine(row),
    state: helperState(row),
    report: row.data?.report || "",
});
