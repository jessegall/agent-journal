// the task line of an agent's row: the task in hand, how many of the agent's tasks are done, and one bar segment for each task

const STAGES = {started: {words: "started"}, testing: {words: "being tested"}, blocked: {words: "blocked"}};
const SEGMENT_LIMIT = 30;

// the tasks that count: a cancelled one is not the agent's to do
const counted = (tasks) => tasks.filter((task) => task.state !== "cancelled");

// the segments run done, the task in hand whole, then those to come; a long list is one continuous bar in the same order
export function taskSegments(tasks, inHand) {
    const all = counted(tasks);
    const done = all.filter((task) => task.state === "completed").length;
    const current = STAGES[inHand?.state] && all.some((task) => task.id === inHand.id && task.state !== "completed") ? 1 : 0;
    if (all.length > SEGMENT_LIMIT) {
        return {continuous: true, done: (done / all.length) * 100, now: (current / all.length) * 100, segments: []};
    }
    const kinds = [...Array(done).fill("done"), ...Array(current).fill("now"), ...Array(all.length - done - current).fill("todo")];
    return {continuous: false, done: 0, now: 0, segments: kinds.map((kind) => ({kind}))};
}

export function taskLine({tasks, inHand, perHour}) {
    const all = counted(tasks);
    const done = all.filter((task) => task.state === "completed").length;
    const stage = STAGES[inHand?.state];
    const left = all.length - done - (inHand && inHand.state !== "completed" ? 1 : 0);
    const finished = done === all.length;
    return {
        number: inHand.id,
        title: inHand.title,
        count: `${done} of ${all.length}`,
        taskTip: `${done} of its ${all.length} tasks done${stage ? `. This one is ${stage.words}.` : "."}`,
        countTip: finished ? `All ${all.length} tasks done` : `${done} done, 1 in hand, ${left} to go`,
        paceTip: !finished && perHour ? `About ${perHour} an hour.` : "",
        bar: taskSegments(tasks, inHand),
    };
}
