import {nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import RowMoves from "../src/resource/RowMoves.vue";
import {movesOf} from "../src/domain/resourceNouns.js";
import {appended as mounted, settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));


test("a running agent offers pause and stop, a paused one resume, an ended one nothing", () => {
    expect(movesOf("agent", {ended_at: null, paused_at: null}).map((move) => move.word)).toEqual(["pause", "stop"]);
    expect(movesOf("agent", {ended_at: null, paused_at: "2026-11-01T10:00:00Z"}).map((move) => move.word)).toEqual(["resume", "stop"]);
    expect(movesOf("agent", {ended_at: "2026-11-01T10:00:00Z"})).toEqual([]);
});

test("stopping an agent asks before it runs", async () => {
    const ran = [];
    const element = mounted(RowMoves, {noun: "agent", id: 7, row: {ended_at: null, paused_at: null}, read: async (line) => (ran.push(line.join(" ")), {ok: true, value: {}})});
    element.querySelector('[data-move="stop"]').click();
    await settle();
    expect(ran).toEqual([]);
    expect(element.querySelector("[data-resource-confirm]").textContent).toContain("Stop the agent?");
    element.querySelector("[data-resource-confirm-yes]").click();
    await settle();
    expect(ran).toEqual(["agent stop 7"]);
});
