// the task line of an agent's row: the task in hand, how many of the agent's tasks are done, and the counts its bar draws: done, in testing and all

const STAGES = {started: {words: "started"}, testing: {words: "being tested"}, blocked: {words: "blocked"}};

// the tasks that count: a cancelled one is not the agent's to do
const counted = (tasks) => tasks.filter((task) => task.state !== "cancelled");
const inState = (tasks, state) => tasks.filter((task) => task.state === state).length;

export function taskLine({tasks, inHand, perHour}) {
    const all = counted(tasks);
    const done = inState(all, "completed");
    const stage = STAGES[inHand?.state];
    const left = all.length - done - (inHand && inHand.state !== "completed" ? 1 : 0);
    const finished = done === all.length;
    return {
        number: inHand.id,
        title: inHand.title,
        plan: inHand.plan_id ?? 0,
        count: `${done} of ${all.length}`,
        taskTip: `${done} of its ${all.length} tasks done${stage ? `. This one is ${stage.words}.` : "."}`,
        countTip: finished ? `All ${all.length} tasks done` : `${done} done, 1 in hand, ${left} to go`,
        paceTip: !finished && perHour ? `About ${perHour} an hour.` : "",
        rate: !finished && perHour ? `${Math.round(perHour)}/hour` : "",
        bar: {total: all.length, done, testing: inState(all, "testing")},
    };
}
