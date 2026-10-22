import {expect, test} from "vitest";
import {threadTurns} from "../src/domain/thread.js";

const at = (n) => new Date(Date.UTC(2026, 9, 21, 12, 0, n)).toISOString();
const message = (id, fields) => ({id, table: "messages", text: "", files: [], created_at: at(id), data: {}, ...fields});

test("hiding agents talking to each other leaves no worker or subagent mark or report in the thread", () => {
    const messages = [
        message(1, {author: "user", creator: "user:1", text: "build the parser"}),
        message(2, {
            author: "system",
            creator: "agent:s1",
            text: "Dispatched Lady Lovelace",
            data: {kind: "card", icon: "agents", key: "worker:4", shows: "workers"},
        }),
        message(3, {
            author: "system",
            creator: "agent:s1",
            text: "Subagent",
            data: {kind: "subagent", detail: "read the parser", state: "running", shows: "subagents"},
        }),
        message(4, {
            author: "agent",
            creator: "agent:s1",
            text: "Lady Lovelace reports: the parser is done",
            data: {kind: "report", worker: "Lady Lovelace", worker_id: 4},
        }),
        message(5, {author: "agent", creator: "agent:s1", text: "The parser is in."}),
    ];
    const texts = (hidden) =>
        threadTurns(messages, [], false, hidden)
            .turns.flatMap((turn) => turn.turns || [turn])
            .map((turn) => turn.text);
    expect(texts([])).toHaveLength(5);
    expect(texts(["agents"])).toEqual(["build the parser", "The parser is in."]);
    expect(texts(["workers"])).not.toContain("Lady Lovelace reports: the parser is done");
});
