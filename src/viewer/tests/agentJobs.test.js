import {expect, test} from "vitest";
import AgentJobs from "../../core/modules/schedules/web/src/AgentJobs.vue";
import {nextRun, scheduleWords} from "../../core/modules/schedules/web/src/cron.js";
import {context, mounted, page, settle} from "./support/windowContext.js";

const JOB = {id: 1, job_id: "1a2b3c4d", cron: "*/10 * * * *", prompt: "Check the build\nand say", is_recurring: true, stop_asked_at: null};

test("a job shows its first line, schedule in words and next run, and Stop asks the agent", async () => {
    const window = {...context({"scheduled-job running --agent 7": page([JOB])}, 7), lines: []};
    window.run = async (line) => (window.lines.push(line), {ok: true});
    const element = await mounted(AgentJobs, window);
    const row = element.querySelector('[data-job="1a2b3c4d"]');
    expect(row.textContent).toContain("Check the build");
    expect(row.textContent).not.toContain("and say");
    expect(row.textContent).toContain("every 10 minutes");
    expect(row.textContent).toContain("next at");
    row.querySelector("[data-job-stop]").click();
    await settle();
    expect(window.lines).toEqual([["scheduled-job", "stop", "1"]]);
});

test("a job being stopped says so and cannot be stopped twice, and none says so", async () => {
    const asked = await mounted(AgentJobs, context({"scheduled-job running --agent 7": page([{...JOB, stop_asked_at: "2026-11-01"}])}, 7));
    expect(asked.querySelector("[data-job-stop]").textContent).toContain("Stopping");
    expect(asked.querySelector("[data-job-stop]").disabled).toBe(true);
    expect((await mounted(AgentJobs, context({"scheduled-job running --agent 7": page([])}, 7))).textContent).toContain("The agent has scheduled nothing");
});

test("the schedule reads in words and the next run is worked out", () => {
    expect(scheduleWords("0 9 * * *")).toBe("every day at 09:00");
    expect(nextRun("*/10 * * * *", new Date(2026, 10, 1, 12, 3)).getMinutes()).toBe(10);
    expect(nextRun("not a cron")).toBeNull();
});
