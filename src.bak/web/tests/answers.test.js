// @vitest-environment node
import {beforeEach, describe, expect, test, vi} from "vitest";

const act = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {act: (...a) => act(...a), dismissQuestion: vi.fn()}}));
vi.mock("../src/domain/spec.js", () => ({word: (type, method) => (method === "complete" ? "answer" : method)}));

const {answer, answered} = await import("../src/chat/answers.js");

const open = {ref: "question:5", type: "question", n: 5, completed: 0, outcome: "", data: {chosen: 1, answered_by: "agent", reason: "x"}};

beforeEach(() => {
    act.mockReset();
    act.mockResolvedValue({});
});

describe("answering a question", () => {
    test("an open question is completed with the answer", async () => {
        await answer(open, "Yes");
        expect(act).toHaveBeenCalledWith("question", 5, "answer", {how: "Yes"});
    });

    test("a completed question has its outcome overwritten instead", async () => {
        await answer({...open, ref: "question:6", n: 6, completed: 9}, "In my own words");
        expect(act).toHaveBeenCalledWith("question", 6, "set", {key: "outcome", value: "In my own words"});
    });

    test("the answer shows as given at once", async () => {
        const question = {...open, ref: "question:7", n: 7};
        const sending = answer(question, "Maybe");
        expect(answered(question)).toMatchObject({outcome: "Maybe", data: {answered_by: "user", chosen: 0, reason: ""}});
        await sending;
    });

    test("a failed send marks the answer as not saved, with the words kept", async () => {
        const question = {...open, ref: "question:8", n: 8};
        act.mockRejectedValue(new Error("down"));
        await answer(question, "Maybe");
        const shown = answered(question);
        expect(shown.unsaved).toBe("Maybe");
        expect(shown.outcome).toBe("");
    });

    test("answering again replaces the failed attempt", async () => {
        const question = {...open, ref: "question:9", n: 9};
        act.mockRejectedValueOnce(new Error("down"));
        await answer(question, "First");
        await answer(question, "Second");
        const shown = answered(question);
        expect([shown.unsaved, shown.outcome]).toEqual([undefined, "Second"]);
    });

    test("a question whose outcome already matches is returned as it is", async () => {
        const question = {...open, ref: "question:10", n: 10};
        await answer(question, "Same");
        const settled = {...question, outcome: "Same"};
        expect(answered(settled)).toBe(settled);
    });
});
