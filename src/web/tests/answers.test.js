// @vitest-environment node
import {beforeEach, describe, expect, test, vi} from "vitest";

const act = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {act: (...a) => act(...a)}}));

const {answer, answered} = await import("../src/chat/answers.js");

const question = (id) => ({table: "questions", id, text: "Which?", options: ["Yes", "No"], answer: null});

beforeEach(() => {
    act.mockReset();
    act.mockResolvedValue({});
});

describe("answering a question", () => {
    test("an open question is answered by its own act", async () => {
        await answer(question(5), "Yes");
        expect(act).toHaveBeenCalledWith("questions", 5, "answer", {answer: "Yes"});
    });

    test("the answer shows as given at once", async () => {
        const asked = question(7);
        const sending = answer(asked, "Maybe");
        expect(answered(asked).answer).toBe("Maybe");
        await sending;
    });

    test("a failed send marks the answer as not saved, with the words kept", async () => {
        const asked = question(8);
        act.mockRejectedValue(new Error("down"));
        await answer(asked, "Maybe");
        const shown = answered(asked);
        expect([shown.unsaved, shown.answer]).toEqual(["Maybe", null]);
    });

    test("answering again replaces the failed attempt", async () => {
        const asked = question(9);
        act.mockRejectedValueOnce(new Error("down"));
        await answer(asked, "First");
        await answer(asked, "Second");
        const shown = answered(asked);
        expect([shown.unsaved, shown.answer]).toEqual([undefined, "Second"]);
    });

    test("a question whose answer already matches is returned as it is", async () => {
        const asked = question(10);
        await answer(asked, "Same");
        const settled = {...asked, answer: "Same"};
        expect(answered(settled)).toBe(settled);
    });
});
