// @vitest-environment node
import {expect, test} from "vitest";
import {COMPACTING_SECONDS, beatsAfter, cardsMoved, cardsOfMarks, facesAfter, justCompacted, processEndsAfter, readingsAfter, testResultsAfter, writtenFacesAfter} from "../src/domain/figureState.js";
import {messagesOfRows} from "../src/figure/chatRows.js";
import {attachmentRead} from "../src/figure/looks.js";
import {buildRuns} from "../src/figure/parcels.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
let marks = 0;
const mark = (type, variant, fields = {}) => ({id: ++marks, type, variant, key: `${type}:${variant}`, text: "", outcome: "none", ended_at: null, created_at: at(10), ...fields});

test("each mark the journal writes in the chat is its own moment, and nothing else is", () => {
    const marks = [
        mark("tasks.task", "closed"),
        mark("tasks.task", "started"),
        mark("questions.question", "open"),
        mark("questions.answer", "agent"),
        mark("memories.memory", "made"),
        mark("memories.reminder", "made"),
        mark("memories.memory", "weighed"),
        mark("workers.tests", "passed"),
        mark("workers.tests", "failed"),
        mark("workers.worker", "merged"),
        mark("workers.worker", "delivered"),
        mark("workers.worker", "released"),
        mark("workers.worker", "started"),
        mark("plugins.card", "warn", {key: "plugin:code-commandments:sins:src/a.py"}),
        mark("plugins.card", "good", {key: "plugin:code-commandments:sins:src/b.py"}),
        mark("plugins.card", "good", {key: "plugin:other:note"}),
    ];
    expect(beatsAfter({data: {cards: cardsOfMarks(marks)}}, 0).map((fire) => fire.beat).sort()).toEqual(
        ["answered", "check_passed", "committed", "fact_filed", "fact_filed", "failed", "question_asked", "refused", "reported", "sin_committed", "sin_fixed", "task_finished"],
    );
    expect(beatsAfter({data: {cards: cardsOfMarks(marks)}}, 10), "what the last look saw is no moment again").toEqual([]);
});

test("a file's sins repented in its one mark is a moment when its tone changes, once, though the mark keeps the time it was made", () => {
    const sin = (variant) => cardsOfMarks([mark("plugins.card", variant, {id: 77, key: "plugin:code-commandments:sins:src/a.py"})]);
    const known = new Map();
    const beats = (cards, seen) => beatsAfter({data: {cards}}, seen).map((fire) => fire.beat);
    expect(beats(cardsMoved(sin("warn"), known, 50), 5), "first seen, it keeps its own time").toEqual(["sin_committed"]);
    expect(beats(cardsMoved(sin("warn"), known, 60), 50), "unchanged, it is no moment again").toEqual([]);
    expect(beats(cardsMoved(sin("good"), known, 70), 60)).toEqual(["sin_fixed"]);
    expect(beats(cardsMoved(sin("good"), known, 80), 70), "and seen once").toEqual([]);
});

test("a card is keyed as the page marks its mark, chat_mark and its id (markLook.js), so the figure can find it there", () => {
    const row = {id: 12, type: "tasks.task", variant: "closed", key: "closed:3:4", text: "", outcome: "none", ended_at: null, created_at: at(10)};
    expect(cardsOfMarks([row])[0].key).toBe("chat_mark:12");
});

test("what the user last said is the moment heard, once", () => {
    const lead = {data: {cards: [], person_at: 12}};
    expect(beatsAfter(lead, 5).map((fire) => fire.beat)).toEqual(["heard"]);
    expect(beatsAfter(lead, 12)).toEqual([]);
});

test("a compaction's mark holds the figure in the compacting state for a while, not for good", () => {
    const cards = cardsOfMarks([mark("memories.compaction", "compacted")]);
    expect(justCompacted(cards, 10)).toBe(true);
    expect(justCompacted(cards, 10 + COMPACTING_SECONDS)).toBe(false);
});

test("a run's mark is a test run or a build as its title says, in any case", () => {
    const [tests, build, plain] = cardsOfMarks([mark("processes.command", "running", {text: "Running Tests"}), mark("processes.command", "running", {text: "Ran npm run BUILD"}), mark("processes.command", "running", {text: "Running ls"})]);
    expect([tests.guesses.test, build.guesses.build, plain.guesses.test, plain.guesses.build]).toEqual([true, true, false, false]);
    expect(buildRuns([tests, build, plain])).toEqual([build]);
});

test("a run seen going and then ended is its end, lit as it ended, and a test run's end a moment", () => {
    const run = (outcome, ended) => mark("processes.command", "running", {id: 9, key: "process:9", text: "Running tests", outcome, ended_at: ended ? at(20) : null});
    const ends = new Map();
    const tests = new Map();
    processEndsAfter({data: {cards: cardsOfMarks([run("running", false)])}}, ends);
    testResultsAfter({data: {cards: cardsOfMarks([run("running", false)])}}, tests, 0);
    const over = {data: {cards: cardsOfMarks([run("failed", true)])}};
    expect(processEndsAfter(over, ends)).toEqual([{tone: "bad", time: 10, card: "chat_mark:9"}]);
    expect(testResultsAfter(over, tests, 0).map((fire) => fire.beat)).toEqual(["tests_failed"]);
    expect(processEndsAfter(over, ends), "an end is seen once").toEqual([]);
});

test("the chat's rows as the figure reads them: the user's and the agent's, each marked as its bubble is, never one still being sent", () => {
    const read = messagesOfRows([
        {id: 1, type: "user", text: "hello", created_at: at(5), read_at: at(8)},
        {id: 2, type: "comment", text: "this one", created_at: at(6)},
        {id: 3, type: "agent", text: "done 🙏 🎩", created_at: at(7)},
        {id: 4, type: "journal", text: "a note", created_at: at(7)},
        {id: 5, type: "peer", text: "from a peer", created_at: at(7)},
        {id: "sending-1", type: "user", text: "on its way", created_at: 9000, local: true},
    ]);
    expect(read.map((message) => [message.id, message.author])).toEqual([[1, "user"], [2, "user"], [3, "agent"]]);
    expect(readingsAfter(read, 0)).toEqual([{beat: "read_message", time: 8, card: "message:1"}]);
    expect(writtenFacesAfter(read, 0)).toEqual([{beat: "agent_reacted:🙏", time: 7, card: "message:3"}]);
    expect(writtenFacesAfter(read, 7)).toEqual([]);
});

test("a face that lands is a moment by who put it there, on the message it is on", () => {
    const faces = [{author: "user", emoji: "❤️", message_id: 3, created_at: at(9)}, {author: "agent", emoji: "🎩", message_id: 4, created_at: at(10)}, {author: "peer", emoji: "👍", message_id: 4, created_at: at(10)}];
    expect(facesAfter(faces, 0)).toEqual([{beat: "reacted:❤️", time: 9, card: "message:3"}, {beat: "agent_reacted:🎩", time: 10, card: "message:4"}]);
    expect(facesAfter(faces, 9.5).map((fire) => fire.beat)).toEqual(["agent_reacted:🎩"]);
});

test("the message whose file the agent reads is read from the tool line, none for any other line", () => {
    expect(attachmentRead("Read .journal/files/message/42/shot.png")).toBe(42);
    expect(attachmentRead("Read src/a.py")).toBe(0);
    expect(attachmentRead("")).toBe(0);
});
