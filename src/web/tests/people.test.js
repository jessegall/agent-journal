import {createApp, nextTick} from "vue";
import {beforeEach, expect, test, vi} from "vitest";
import {tip} from "../src/kit/tip.js";

const hostingMe = vi.fn();
const members = vi.fn();
const inviteMember = vi.fn();
const assignRole = vi.fn();
let refuse = () => {};
vi.mock("../src/api/client.js", () => ({
    api: {
        hostingMe: (...a) => hostingMe(...a),
        members: (...a) => members(...a),
        inviteMember: (...a) => inviteMember(...a),
        assignRole: (...a) => assignRole(...a),
    },
    onWrite: vi.fn(),
    onBlocked: (fn) => (refuse = fn),
}));

const {default: People} = await import("../src/layout/People.vue");
const {default: BlockedNotice} = await import("../src/layout/BlockedNotice.vue");
const {me} = await import("../src/composables/me.js");
const {memberStatus} = await import("../src/domain/members.js");
const {answered} = await import("../src/api/transport.js");

const OWNER = {member: "owner", name: "Owner", role: "owner", owner: true, abilities: {can: ["Read every page of this journal"], cannot: []}};
const READER = {
    member: "m-1",
    name: "Ada",
    role: "reader",
    owner: false,
    abilities: {
        can: ["Read every page of this journal"],
        cannot: [{text: "Write messages, to-dos, comments and documents, and answer questions", why: "Your role is reader; the owner can make you a writer."}],
    },
};

const flush = async () => {
    for (let i = 0; i < 6; i++) await nextTick();
};

async function mounted(component) {
    const into = document.createElement("div");
    document.body.append(into);
    const app = createApp(component);
    app.directive("tip", tip);
    app.mount(into);
    await flush();
    return into;
}

const pressed = (label) => [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === label).click();

beforeEach(() => {
    document.body.innerHTML = "";
    me.value = null;
    vi.clearAllMocks();
});

test("a member reads as joined or as invited and not joined yet", () => {
    expect(memberStatus({joined: 12})).toBe("Joined");
    expect(memberStatus({joined: 0})).toBe("Invited, has not joined yet");
});

test("the owner invites a person as a reader and gets the link to send them", async () => {
    hostingMe.mockResolvedValue(OWNER);
    members.mockResolvedValueOnce({members: []}).mockResolvedValue({members: [{id: "m-1", name: "Ada", role: "reader", joined: 0}]});
    inviteMember.mockResolvedValue({member: {id: "m-1", name: "Ada"}, link: "https://journal.example.com/join?code=abc"});
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    expect(document.body.textContent).toContain("Only you can log in to this journal.");
    const field = document.querySelector("#invite-name");
    field.value = "Ada";
    field.dispatchEvent(new Event("input"));
    pressed("Reader");
    await flush();
    pressed("Invite");
    await flush();
    expect(inviteMember).toHaveBeenCalledWith("Ada", "reader");
    expect(document.body.textContent).toContain("Send this link to Ada.");
    expect(document.body.textContent).toContain("Invited, has not joined yet");
});

test("the owner makes a reader a writer from the members list", async () => {
    hostingMe.mockResolvedValue(OWNER);
    members.mockResolvedValue({members: [{id: "m-1", name: "Ada", role: "reader", joined: 3}]});
    assignRole.mockResolvedValue({});
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    document.querySelector('[aria-label="Members"] [role="radio"]').click();
    await flush();
    expect(assignRole).toHaveBeenCalledWith("m-1", "writer");
});

test("a member sees their role, what they can do and why they cannot do the rest", async () => {
    hostingMe.mockResolvedValue(READER);
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    const text = document.body.textContent;
    expect(text).toContain("You are Ada, a reader in this journal.");
    expect(text).toContain("Write messages, to-dos, comments and documents, and answer questions. Your role is reader; the owner can make you a writer.");
    expect(document.querySelector("#invite-name")).toBeNull();
    expect(members).not.toHaveBeenCalled();
});

test("a change the gateway blocks shows why, whichever control sent it", async () => {
    const blocked = await answered(new Response(JSON.stringify({error: "Readers read this journal.", blocked: true}), {status: 403}), "403").catch((e) => e);
    const plain = await answered(new Response(JSON.stringify({error: "no such row"}), {status: 404}), "404").catch((e) => e);
    expect([blocked.blocked, plain.blocked]).toEqual([true, false]);
    await mounted(BlockedNotice);
    refuse("Readers read this journal.");
    await flush();
    expect(document.querySelector('[role="status"]').textContent).toContain("You can't do that. Readers read this journal.");
});
