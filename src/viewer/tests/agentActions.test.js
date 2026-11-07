import {h, reactive} from "vue";
import {afterEach, expect, test, vi} from "vitest";
import AgentActions from "../../core/modules/agents/web/src/AgentActions.vue";
import AgentCard from "../../core/modules/agents/web/src/AgentCard.vue";
import {context, mounted, page, pickButton, settle, typeInto} from "./support/agentWindowContext.js";

const helper = {id: 42, role: "helper", state: "idle", ended_at: "2026-11-01T10:00:00Z", job_command: ["helper", "send"], job_task_flag: "", resume_reason: null};
afterEach(() => { document.body.innerHTML = ""; });
async function actions(row = helper, run = vi.fn(async () => ({ok: true})), answers = {}) {
    const held = {...context(answers), run};
    const element = await mounted({render: () => h(AgentActions, {row})}, held);
    document.body.append(element);
    return {element, held, run};
}

test("a working agent does not offer card actions", async () => {
    const {element} = await actions({...helper, state: "running", ended_at: null});
    expect(element.querySelector("[data-agent-send-job]")).toBeNull();
    expect(element.querySelector("[data-agent-retire]")).toBeNull();
    expect(element.querySelector("[data-agent-send-message]")).toBeNull();
});

test("an idle helper takes another job on the same agent", async () => {
    const {element, run} = await actions();
    expect(element.querySelector("[data-agent-send-message]")).toBeNull();
    await pickButton(element, "Send a job");
    typeInto(element.querySelector("[data-agent-job-text]"), "Read src/tax.py");
    await settle();
    await pickButton(element, "Send the job");
    expect(run).toHaveBeenCalledExactlyOnceWith(["helper", "send", "42", "Read src/tax.py"]);
});

test("a type declaring task jobs sends the selected open task", async () => {
    const {element, run} = await actions({...helper, role: "writer", job_command: ["writer", "send"], job_task_flag: "--task"}, undefined, {"task list": page([{id: 9, title: "Fix tax", state: "open"}])});
    await pickButton(element, "Send a job");
    expect(element.querySelector("[data-agent-job-text]")).toBeNull();
    expect(element.querySelector("[data-agent-submit-job]").disabled).toBe(true);
    const select = element.querySelector("[data-agent-job-task]");
    select.value = "9";
    select.dispatchEvent(new Event("change"));
    await settle();
    await pickButton(element, "Send the job");
    expect(run).toHaveBeenCalledExactlyOnceWith(["writer", "send", "42", "--task", "9"]);
});

test("retirement requires a separate permanent confirmation and a reason", async () => {
    const {element, run} = await actions();
    await pickButton(element, "Retire");
    expect(run).not.toHaveBeenCalled();
    expect(element.textContent).toContain("Retirement is permanent. This agent cannot be resumed.");
    expect(element.querySelector("[data-agent-confirm-retire]").disabled).toBe(true);
    typeInto(element.querySelector("[data-agent-retire-reason]"), "Its question is answered");
    await settle();
    await pickButton(element, "Cancel");
    expect(run).not.toHaveBeenCalled();
    await pickButton(element, "Retire");
    typeInto(element.querySelector("[data-agent-retire-reason]"), "Its question is answered");
    await settle();
    await pickButton(element, "Retire permanently");
    expect(run).toHaveBeenCalledExactlyOnceWith(["agent", "retire", "42", "--reason", "Its question is answered"]);
});

test("the task picker reads later pages without losing its selection", async () => {
    const first = {ok: true, value: {rows: [{id: 9, title: "First", state: "open"}], page: 1, size: 1, total: 2}};
    const second = {ok: true, value: {rows: [{id: 10, title: "Later", state: "open"}], page: 2, size: 1, total: 2}};
    const {element} = await actions({...helper, job_task_flag: "--task"}, undefined, {"task list --state open --limit 100 --page 1": first, "task list --state open --limit 100 --page 2": second});
    await pickButton(element, "Send a job");
    const select = element.querySelector("[data-agent-job-task]");
    select.value = "9";
    select.dispatchEvent(new Event("change"));
    await pickButton(element, "More tasks");
    expect(select.value).toBe("9");
    expect([...select.options].map((item) => item.value)).toEqual(["", "9", "10"]);
    expect(element.querySelector("[data-agent-more-tasks]")).toBeNull();
});

test("a refused retirement keeps its reason and shows the command refusal", async () => {
    const {element} = await actions(helper, vi.fn(async () => ({ok: false, error: "The agent still holds work"})));
    await pickButton(element, "Retire");
    typeInto(element.querySelector("[data-agent-retire-reason]"), "Its question is answered");
    await settle();
    await pickButton(element, "Retire permanently");
    expect(element.querySelector('[role="alert"]').textContent).toBe("The agent still holds work");
    expect(element.querySelector("[data-agent-retire-reason]").value).toBe("Its question is answered");
});

test("a pending job cannot be sent twice or retired", async () => {
    let finish;
    const {element, run} = await actions(helper, vi.fn(() => new Promise((resolve) => { finish = resolve; })));
    await pickButton(element, "Send a job");
    typeInto(element.querySelector("[data-agent-job-text]"), "Read tax");
    await settle();
    element.querySelector("[data-agent-submit-job]").click();
    await settle();
    expect(element.querySelector("[data-agent-retire]").disabled).toBe(true);
    element.querySelector("[data-agent-submit-job]").click();
    expect(run).toHaveBeenCalledTimes(1);
    finish({ok: true});
    await settle();
});

test("an unavailable session can be retired but cannot be sent a job", async () => {
    const {element} = await actions({...helper, resume_reason: "The session is gone"});
    expect(element.querySelector("[data-agent-send-job]").disabled).toBe(true);
    expect(element.querySelector("[data-agent-retire]").disabled).toBe(false);
});

test("a retired card offers only its transcript and no composer", async () => {
    const row = reactive({...helper, retired_at: null, access: "writing", program: "claude"});
    const held = {...context({"agent transcript": page([])}), tabs: [{key: "tasks", label: "Tasks"}, {key: "transcript", label: "Transcript"}, {key: "terminal", label: "Terminal"}]};
    const element = await mounted({render: () => h(AgentCard, {row, facts: {tasks: []}, open: true})}, held);
    expect(element.querySelector('[data-agent-tab-body="tasks"]')).not.toBeNull();
    row.state = "retired";
    row.retired_at = "2026-11-02T10:00:00Z";
    await settle();
    expect([...element.querySelectorAll("[data-tab]")].map((tab) => tab.dataset.tab)).toEqual(["transcript"]);
    expect(element.querySelector("[data-agent-actions]")).toBeNull();
    expect(element.querySelector("textarea")).toBeNull();
});
