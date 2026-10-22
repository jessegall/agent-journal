import {beforeEach, describe, expect, test, vi} from "vitest";

const server = {create: vi.fn(), upload: vi.fn()};
vi.mock("../src/api/client.js", () => ({api: {at: () => server}}));
vi.mock("../src/composables/poll.js", () => ({pollNow: vi.fn(), startPoll: vi.fn()}));

const {sendMessage, onOutboxChange} = await import("../src/chat/outbox.js");

const queued = () => JSON.parse(localStorage.getItem("journal.outbox.v4") || "[]");
const body = {text: "A line", reply_target: 3};
const text = (name, words) => new File([words], name, {type: "text/plain"});
const delivered = async (env, sent, files, id) => (await sendMessage(env, sent, files, id)).delivered;

beforeEach(() => {
    localStorage.clear();
    server.create.mockReset().mockResolvedValue({id: 41});
    server.upload.mockReset().mockResolvedValue({});
    onOutboxChange(() => {});
});

describe("sending a message", () => {
    test("a message that reaches the server leaves nothing queued", async () => {
        expect(await delivered("main", body, [], "id-1")).toBe(true);
        expect(queued()).toEqual([]);
        expect(server.create).toHaveBeenCalledWith("messages", {text: "A line", reply_target: 3, idempotency: "id-1"});
    });

    test("a message sent while the server is away stays queued and says so", async () => {
        server.create.mockRejectedValue(new TypeError("offline"));
        expect(await delivered("main", body, [], "id-2")).toBe(false);
        expect(queued().map((r) => r.id)).toEqual(["id-2"]);
    });

    test("the next send retries the queued one under the same key, so the server can drop a double", async () => {
        server.create.mockRejectedValueOnce(new TypeError("offline"));
        await delivered("main", body, [], "id-3");
        const changed = vi.fn();
        onOutboxChange(changed);
        await delivered("main", {...body, text: "Second"}, [], "id-4");
        expect(server.create.mock.calls.map(([, sent]) => sent.idempotency)).toEqual(["id-3", "id-3", "id-4"]);
        expect(changed).toHaveBeenCalledWith(["id-3", "id-4"]);
        expect(queued()).toEqual([]);
    });

    test("a message for another environment is left for that environment", async () => {
        server.create.mockRejectedValueOnce(new TypeError("offline"));
        await delivered("other", body, [], "id-5");
        await delivered("main", body, [], "id-6");
        expect(queued().map((r) => r.id)).toEqual(["id-5"]);
    });

    test("a send is kept before the server answers, so the next one need not wait for it", async () => {
        let answer;
        server.create.mockReturnValueOnce(new Promise((resolve) => (answer = resolve)));
        const first = await sendMessage("main", body, [], "id-12");
        const second = await sendMessage("main", {...body, text: "Second"}, [], "id-13");
        expect(queued().map((r) => r.id)).toEqual(["id-12", "id-13"]);
        answer({id: 41});
        expect([await first.delivered, await second.delivered]).toEqual([true, true]);
        expect(server.create.mock.calls.map(([, sent]) => sent.idempotency)).toEqual(["id-12", "id-13"]);
    });
});

describe("files with a message", () => {
    test("each file is uploaded to the message that was made, with its bytes intact", async () => {
        await delivered("main", body, [text("a.txt", "héllo")], "id-8");
        const [type, n, file] = server.upload.mock.calls[0];
        expect([type, n, file.name, file.type]).toEqual(["messages", 41, "a.txt", "text/plain"]);
        expect(await file.text()).toBe("héllo");
    });

    test("a failed upload is resumed without sending the finished ones again", async () => {
        server.upload.mockResolvedValueOnce({}).mockRejectedValueOnce(new TypeError("offline"));
        expect(await delivered("main", body, [text("a.txt", "1"), text("b.txt", "2")], "id-9")).toBe(false);
        expect(queued()[0].uploaded).toEqual([true]);
        await delivered("main", body, [], "id-10");
        const names = server.upload.mock.calls.map(([, , file]) => file.name);
        expect(names).toEqual(["a.txt", "b.txt", "b.txt"]);
    });
});

describe("a full store", () => {
    test("a message that could be kept nowhere is refused instead of being lost silently", async () => {
        const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("full");
        });
        await expect(sendMessage("main", body, [], "id-11")).rejects.toThrow("Could not save the message for retry");
        expect(server.create).not.toHaveBeenCalled();
        set.mockRestore();
    });
});
