import {context} from "./windowContext.js";

export const taskWindowContext = (answers) => context(answers, null, {
    board: {line: "task board", tab: "list", events: ["task.*", "task_tag.*"]},
    tags: {line: "task tags", tab: "list", events: ["task_tag.*"]},
    group: {line: "task board", loading: "requested"},
    graph: {line: "task graph", tab: "graph", events: ["task.*"]},
    places: {line: "plan places", loading: "requested"},
    "task.*": {line: "task show {id}", loading: "requested"},
});
