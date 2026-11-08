// the task line of an agent's row: the task in hand, how many of the agent's tasks are done, and one bar segment for each task

const STAGES = {started: {fill: 33, words: "started"}, testing: {fill: 66, words: "being tested"}, blocked: {fill: 33, words: "blocked"}};
const SEGMENT_LIMIT = 30;

// the tasks that count: a cancelled one is not the agent's to do
const counted = (tasks) => tasks.filter((task) => task.state !== "cancelled");

export function taskSegments(tasks, inHand) {
    const all = counted(tasks);
    const stage = STAGES[inHand?.state];
    if (all.length > SEGMENT_LIMIT) {
        const done = all.filter((task) => task.state === "completed").length;
        return {continuous: true, done: (done / all.length) * 100, now: stage ? (stage.fill / 100 / all.length) * 100 : 0, segments: []};
    }
    const segments = all.map((task) => {
        if (task.state === "completed") return {kind: "done", fill: 0};
        return task.id === inHand?.id && stage ? {kind: "now", fill: stage.fill} : {kind: "todo", fill: 0};
    });
    return {continuous: false, done: 0, now: 0, segments};
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
