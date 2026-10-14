import {describe, expect, test} from "vitest";
import EmptyState from "../src/kit/EmptyState.vue";
import {shown as drawn} from "./shown.js";

const shown = (props) => drawn(EmptyState, props, () => "No documents yet");

describe("an empty state over a list that loads", () => {
    test("shows a skeleton while the load has not answered, never the empty words", async () => {
        const host = await shown({loading: true, title: "Nothing here"});
        expect(host.querySelector("[aria-busy='true']")).not.toBeNull();
        expect(host.textContent).not.toContain("No documents yet");
    });

    test("says it is empty once the load has answered with nothing", async () => {
        const host = await shown({title: "Nothing here"});
        expect(host.querySelector("[aria-busy='true']")).toBeNull();
        expect(host.textContent).toContain("No documents yet");
    });

    test("draws the shape it is given", async () => {
        const host = await shown({loading: true, shape: "cards"});
        expect(host.querySelectorAll(".skeleton-card").length).toBeGreaterThan(0);
    });
});
