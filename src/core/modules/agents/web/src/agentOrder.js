// a working agent whose process has stopped waits on its tests, a merge or an answer: it stays listed, dimmed
export const isWaiting = (row) => row.state === "running" && Boolean(row.ended_at);

// the agents busy now first, then the ones waiting, each group in the order the server gave
export const busyFirst = (rows) => [...rows.filter((row) => !isWaiting(row)), ...rows.filter(isWaiting)];
