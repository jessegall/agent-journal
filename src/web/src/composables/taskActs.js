import {ref} from "vue";
import {api} from "../api/client.js";
import {peek} from "../route.js";
import {questionOf, waitOf} from "../domain/taskBoard.js";
import {taskBoard} from "../state/taskBoard.js";

const DONE_LINES = {
    start: (id) => `Task ${id} started.`,
    reopen: (id) => `Task ${id} is open again.`,
    unblock: (id) => `Task ${id} is open again.`,
    delete: (id) => `Task ${id} deleted.`,
};
const ASKED = ["finish", "suspend", "block", "edit"];

export function select(id) {
    taskBoard.selected = id;
    taskBoard.inspecting = true;
}

// What the tasks dialog does to a task: an act that needs nothing more runs at once, one that needs words opens its form.
export function useTaskActs(client = api) {
    const toast = ref(null);
    const asking = ref(null);
    const say = (text) => (toast.value = {text});

    async function post(task, name, body = {}) {
        try {
            await client.act("tasks", task.id, name, body);
            return true;
        } catch (e) {
            say(e.message);
            return false;
        }
    }

    async function settle(task, name, body, line) {
        if (!(await post(task, name, body))) return;
        asking.value = null;
        say(line);
    }

    function goTo(task) {
        const target = waitOf(task).id;
        taskBoard.statuses = [];
        taskBoard.words = "";
        select(target);
    }

    async function run(task, name) {
        if (ASKED.includes(name)) return (asking.value = {kind: name, task});
        if (name === "answer") return (asking.value = {kind: "answer", question: questionOf(task)});
        if (name === "goto") return goTo(task);
        if (name === "start" && task.worker_id) return peek("workers", task.worker_id);
        if (name === "delete" && taskBoard.selected === task.id) taskBoard.inspecting = false;
        if (await post(task, name)) say(DONE_LINES[name](task.id));
    }

    const finish = (task, how) => settle(task, "finish", {how}, `Task ${task.id} is done.`);
    const suspend = (task, why) => settle(task, "suspend", {why}, `Task ${task.id} is paused.`);
    const block = (task, wait) => settle(task, "block", wait, `Task ${task.id} is blocked.`);

    async function edit(task, fields) {
        try {
            await client.change("tasks", task.id, fields);
            asking.value = null;
            say(`Task ${task.id} saved.`);
        } catch (e) {
            say(e.message);
        }
    }

    async function file({title, brief, plan}) {
        try {
            const made = plan ? await client.addPlanTask(plan, {title, brief}) : await client.create("tasks", {title, brief});
            taskBoard.draft = null;
            taskBoard.selected = made.id;
            say(`Task ${made.id} filed.`);
            return made;
        } catch (e) {
            say(e.message);
            return null;
        }
    }

    return {toast, asking, run, finish, suspend, block, edit, file};
}
