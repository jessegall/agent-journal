import {expect, test, vi} from "vitest";
import Checks from "../../suites/coding/modules/checks/web/src/checks.js";
import {mounted, page, settle} from "./support/windowContext.js";
import {checkWindowContext} from "./support/checkWindowContext.js";

const row = {id: 3, title: "Cart totals", command: "check-cart", stopped: false, last_output: "Totals match", last_passed: true, run_percent: null};

test("the checks window loads its list key and requests history only in the Runs view", async () => {
    document.body.replaceChildren();
    const held = checkWindowContext({"check list": page([row]), "check runs 3": page([{run_at: "2026-11-01T12:00:00Z", passed: true, output: "Earlier totals"}])});
    const element = await mounted(Checks, held);
    expect(held.reads).toEqual(["check list"]);
    element.querySelector('[data-row="3"]').click();
    await settle();
    expect(document.querySelector("[data-check-output]").textContent).toBe("Totals match");
    expect(held.reads).toEqual(["check list"]);
    [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Runs").click();
    await settle();
    expect(held.reads).toEqual(["check list", "check runs 3"]);
    document.querySelector("[data-check-runs] button").click();
    await settle();
    expect(document.querySelector("[data-check-output]").textContent).toBe("Earlier totals");
});

test("a check command refusal leaves the keyed list in place", async () => {
    const held = checkWindowContext({"check list": page([row])});
    held.run = vi.fn(async () => ({ok: false, error: "The check is paused"}));
    const element = await mounted(Checks, held);
    element.querySelector("[data-check-card-run]").click();
    await settle();
    expect(held.run).toHaveBeenCalledExactlyOnceWith(["check", "run", "3"]);
    expect(element.querySelector('[data-row="3"]')).not.toBeNull();
    expect(element.querySelector("[data-check-refusal]").textContent).toBe("The check is paused");
});
