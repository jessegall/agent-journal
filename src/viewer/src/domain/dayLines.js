// The line naming the day before the first turn of each day in the chat: Today, Yesterday, or the weekday, with the date
const DAY_SECONDS = 86400;
const dayStart = (seconds) => new Date(new Date(seconds * 1000).toDateString()).getTime() / 1000;

export function dayLine(seconds, nowSeconds) {
    const date = new Date(seconds * 1000);
    const sameYear = date.getFullYear() === new Date(nowSeconds * 1000).getFullYear();
    const dated = date.toLocaleDateString("en-GB", {day: "numeric", month: "long", ...(sameYear ? {} : {year: "numeric"})});
    const daysAgo = Math.round((dayStart(nowSeconds) - dayStart(seconds)) / DAY_SECONDS);
    if (daysAgo === 0) return `Today, ${dated}`;
    if (daysAgo === 1) return `Yesterday, ${dated}`;
    return `${date.toLocaleDateString("en-GB", {weekday: "long"})}, ${dated}`;
}

export function withDayLines(turns, nowSeconds = Date.now() / 1000) {
    const lined = [];
    let day = 0;
    for (const turn of turns) {
        const start = dayStart(turn.time);
        if (start !== day) {
            day = start;
            lined.push({key: `day:${start}`, kind: "day", who: "", time: turn.time, title: dayLine(turn.time, nowSeconds), text: "", data: {}});
        }
        lined.push(turn);
    }
    return lined;
}
