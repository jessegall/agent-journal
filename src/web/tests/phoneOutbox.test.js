import {beforeEach, describe, expect, test, vi} from "vitest";

class PhoneError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const phone = {say: vi.fn(), attach: vi.fn(), approve: vi.fn(), answer: vi.fn()};
const stash = {stash: vi.fn(async () => {}), unstash: vi.fn(async () => undefined), unstashed: vi.fn(async () => {})};
vi.mock("../src/api/phone.js", () => ({phone, PhoneError}));
vi.mock("../src/phone/stash.js", () => stash);

let outbox;
const file = (name) => new File(["x"], name);
const held = (key) => JSON.parse(localStorage.getItem(key) || "[]");

beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    Object.values(phone).forEach((fn) => fn.mockReset());
    Object.values(stash).forEach((fn) => fn.mockClear());
    let made = 0;
    phone.say.mockImplementation(async () => ({n: ++made}));
    phone.attach.mockResolvedValue({});
    phone.approve.mockResolvedValue({});
    outbox = await import("../src/phone/outbox.js");
    outbox.setPlace("home");
});

describe("a message typed on the phone", () => {
    test("is held, sent once, and then shown as just sent", async () => {
        const line = outbox.hold("hello", "todo:1");
        expect(held("phone-outbox")).toHaveLength(1);
        await outbox.flush();
        expect(phone.say).toHaveBeenCalledTimes(1);
        expect(phone.say).toHaveBeenCalledWith("hello", line.idempotency, "todo:1");
        expect([outbox.waitingToSend.value, held("phone-outbox")]).toEqual([[], []]);
        expect(outbox.justSent.value.map((l) => l.brief)).toEqual(["hello"]);
    });

    test("stays held while the computer cannot be reached, and goes once, under one key, when it can", async () => {
        const line = outbox.hold("hello", "");
        phone.say.mockRejectedValueOnce(new TypeError("offline")).mockRejectedValueOnce(new PhoneError(503, "busy"));
        await expect(outbox.flush()).rejects.toThrow();
        await expect(outbox.flush()).rejects.toThrow();
        expect(outbox.waitingToSend.value).toHaveLength(1);
        await outbox.flush();
        expect(phone.say.mock.calls.map((c) => c[1])).toEqual([line.idempotency, line.idempotency, line.idempotency]);
        expect(outbox.waitingToSend.value).toEqual([]);
    });

    test("a message the computer refuses is marked lost with words, and never sent again", async () => {
        phone.say.mockRejectedValue(new PhoneError(400, "too long"));
        outbox.hold("hello", "");
        await outbox.flush();
        await outbox.flush();
        const [line] = outbox.waitingToSend.value;
        expect(line.lost).toBe(true);
        expect(line.reason).toBe("This was not sent: too long. Write it again in a new message.");
        expect(phone.say).toHaveBeenCalledTimes(1);
    });

    test("a pairing that ended stops the sending and keeps the message", async () => {
        phone.say.mockRejectedValue(new PhoneError(401, "gone"));
        outbox.hold("hello", "");
        await expect(outbox.flush()).rejects.toMatchObject({status: 401});
        expect(outbox.waitingToSend.value).toHaveLength(1);
        expect(outbox.ended(new PhoneError(410, ""))).toBe(true);
        expect(outbox.ended(new PhoneError(400, ""))).toBe(false);
    });

    test("two flushes at once send it once", async () => {
        outbox.hold("hello", "");
        await Promise.all([outbox.flush(), outbox.flush(), outbox.flush()]);
        expect(phone.say).toHaveBeenCalledTimes(1);
    });

    test("a message for another place waits for that place", async () => {
        outbox.hold("hello", "");
        outbox.setPlace("elsewhere");
        await outbox.flush();
        expect(phone.say).not.toHaveBeenCalled();
        expect(outbox.atThisPlace(outbox.waitingToSend.value)).toEqual([]);
        outbox.setPlace("home");
        expect(outbox.atThisPlace(outbox.waitingToSend.value)).toHaveLength(1);
    });

    test("discarding takes a held message away with its files", () => {
        const line = outbox.hold("hello", "", [file("a.txt")]);
        outbox.discard(line.idempotency);
        expect([outbox.waitingToSend.value, held("phone-outbox")]).toEqual([[], []]);
        expect(stash.unstashed).toHaveBeenCalledWith(line.idempotency);
    });

    test("settling forgets the just-sent lines the server now lists", async () => {
        const line = outbox.hold("hello", "");
        await outbox.flush();
        outbox.settle([{data: {idempotency: line.idempotency}}]);
        expect(outbox.justSent.value).toEqual([]);
    });
});

describe("files with a phone message", () => {
    test("a failed attach is sent again without the one already attached", async () => {
        outbox.hold("hello", "", [file("a.txt"), file("b.txt")]);
        phone.attach.mockResolvedValueOnce({}).mockRejectedValueOnce(new TypeError("offline"));
        await expect(outbox.flush()).rejects.toThrow();
        await outbox.flush();
        expect(phone.attach.mock.calls.map((c) => c[1].name)).toEqual(["a.txt", "b.txt", "b.txt"]);
    });

    test("a file the server refuses is named, and the message still counts as sent", async () => {
        outbox.hold("hello", "", [file("a.txt")]);
        phone.attach.mockRejectedValue(new PhoneError(413, "big"));
        await outbox.flush();
        expect(outbox.justSent.value[0].reason).toBe("Message sent, but a.txt could not be attached. Attach again in a new message.");
    });

    test("files that were lost with the page lose the message, with words", async () => {
        localStorage.setItem("phone-outbox", JSON.stringify([{brief: "hi", about: "", idempotency: "k", at: 1, files: ["a.txt"], place: "home"}]));
        vi.resetModules();
        outbox = await import("../src/phone/outbox.js");
        outbox.setPlace("home");
        await outbox.flush();
        expect(phone.say).not.toHaveBeenCalled();
        expect(outbox.waitingToSend.value[0]).toMatchObject({lost: true, reason: "The attached file was lost, so this was not sent. Attach it again in a new message."});
    });
});

describe("a tap on an approval", () => {
    test("is sent at once and says sent", async () => {
        expect(await outbox.perform({kind: "approve", n: 4, updated: 9})).toBe("sent");
        expect(phone.approve).toHaveBeenCalledWith(4, 9);
        expect(outbox.waitingActions.value).toEqual([]);
    });

    test("is held when the computer cannot be reached, then sent by the next flush", async () => {
        phone.approve.mockRejectedValueOnce(new TypeError("offline"));
        expect(await outbox.perform({kind: "approve", n: 4, updated: 9})).toBe("held");
        expect(held("phone-actions")).toHaveLength(1);
        await outbox.flush();
        expect(phone.approve).toHaveBeenCalledTimes(2);
        expect(outbox.waitingActions.value).toEqual([]);
    });

    test("refused by the computer, it tells the person tapping and is not kept", async () => {
        phone.approve.mockRejectedValue(new PhoneError(409, "changed"));
        await expect(outbox.perform({kind: "approve", n: 4, updated: 9})).rejects.toMatchObject({status: 409});
        expect(outbox.waitingActions.value).toEqual([]);
    });

    test("an ended pairing tells the person tapping and keeps the tap", async () => {
        phone.approve.mockRejectedValue(new PhoneError(401, "gone"));
        await expect(outbox.perform({kind: "approve", n: 4, updated: 9})).rejects.toMatchObject({status: 401});
        expect(outbox.waitingActions.value).toHaveLength(1);
    });
});
