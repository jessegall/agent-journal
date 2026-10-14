import {createApp, h, nextTick} from "vue";
import {describe, expect, test} from "vitest";
import {useTranscript} from "../src/composables/transcript.js";

const settled = async (ready) => {
    for (let i = 0; i < 50 && !ready(); i++) await new Promise((resolve) => setTimeout(resolve, 10));
};

function opened() {
    const asked = [];
    const client = {
        env: () => "main",
        transcript: async (agent, session, fields) => {
            asked.push(fields);
            if (fields.entry) return {line: fields.entry, text: "the whole output", said: ""};
            return {total: 1, first: 1, turns: [{line: 1, who: "tool", kind: "tool", at: 1, tools: [], text: "", has_text: true}]};
        },
    };
    let log;
    createApp({
        setup() {
            log = useTranscript(() => 7, "", null, client);
            return () => h("div");
        },
    }).mount(window.document.createElement("div"));
    return {asked, client, get log() {
        return log;
    }};
}

describe("the transcript log", () => {
    test("lists a tool result by its heading and asks for its whole text only when it is opened, once", async () => {
        const run = opened();
        await settled(() => run.log.turns.value.length === 1);
        expect([run.log.turns.value[0].text, run.asked.some((fields) => fields.entry)]).toEqual(["", false]);
        run.log.toggle(1);
        await settled(() => run.log.bodies.value[1] !== undefined);
        run.log.toggle(1);
        run.log.toggle(1);
        await nextTick();
        expect([run.log.bodies.value[1], run.asked.filter((fields) => fields.entry)]).toEqual(["the whole output", [{entry: 1}]]);
    });
});
