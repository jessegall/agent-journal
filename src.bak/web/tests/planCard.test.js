import {describe, expect, test} from "vitest";
import ResourceCard from "../src/resource/ResourceCard.vue";
import {store} from "../src/state/store.js";
import {shown} from "./shown.js";

describe("a plan's card", () => {
    test("counts its to-dos as the plan's page does, with the phase it is in beside it", async () => {
        store.spec = {...store.spec, types: {plan: {}, todo: {}}};
        store.rows = {...store.rows, todo: [{n: 1, completed: 5, deleted: 0, data: {}}, {n: 2, completed: 6, deleted: 0, data: {}}, {n: 3, completed: 0, deleted: 0, data: {}}]};
        const plan = {type: "plan", n: 15, title: "GPS integration", sections: [], refs: [], data: {status: "approved", current: 1, phases: [{title: "One", todos: [1, 2]}, {title: "Two", todos: [3]}]}};
        const card = await shown(ResourceCard, {resource: plan});
        expect(card.querySelector(".plan-steps").textContent).toBe("2 of 3 to-dos done · phase 1 of 2 · approved");
    });
});
