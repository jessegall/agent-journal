const OPEN_TASKS = new Set(["open", "started", "blocked", "testing"]);

// the counts the bars show, from the rows the journal answers: helpers still running beside the main agent, tasks not yet done or
// cancelled, and questions still waiting for an answer
export function barFacts({agents = [], tasks = [], questions = []}) {
    return {
        helpers: agents.filter((agent) => agent.role !== "main" && !agent.ended_at).length,
        tasks: tasks.filter((task) => OPEN_TASKS.has(task.state)).length,
        waiting: questions.filter((question) => question.state === "open").length,
    };
}

export const NO_FACTS = {helpers: 0, tasks: 0, waiting: 0};
