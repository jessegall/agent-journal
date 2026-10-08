import {createApp, nextTick} from "vue";
import {beforeEach, expect, test, vi} from "vitest";
import {tip} from "../src/kit/tip.js";

const hostingMe = vi.fn();
const members = vi.fn();
const inviteMember = vi.fn();
const assignRole = vi.fn();
const removeMember = vi.fn();
const endLogins = vi.fn();
const leaveJournal = vi.fn();
let refuse = () => {};
vi.mock("../src/api/client.js", () => ({
    api: {
        hostingMe: (...a) => hostingMe(...a),
        members: (...a) => members(...a),
        inviteMember: (...a) => inviteMember(...a),
        assignRole: (...a) => assignRole(...a),
        removeMember: (...a) => removeMember(...a),
        endLogins: (...a) => endLogins(...a),
        leaveJournal: (...a) => leaveJournal(...a),
    },
    onWrite: vi.fn(),
    onBlocked: (fn) => (refuse = fn),
}));

const {default: People} = await import("../src/layout/People.vue");
const {default: BlockedNotice} = await import("../src/layout/BlockedNotice.vue");
const {me} = await import("../src/composables/me.js");
const {memberStatus, writerOf} = await import("../src/domain/members.js");
const {people} = await import("../src/composables/people.js");
const {answered, loginPage} = await import("../src/api/transport.js");

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

const pressed = (label) => [...document.querySelectorAll("button")].filter((button) => button.textContent.trim() === label).at(-1).click();

beforeEach(() => {
    document.body.innerHTML = "";
    me.value = null;
    people.value = {owner: null, members: []};
    vi.clearAllMocks();
    members.mockResolvedValue({owner: {name: "Owner", connected: true}, members: []});
});

test("a member reads as connected, not connected or invited and not joined yet", () => {
    expect(memberStatus({joined: 12, connected: true})).toBe("Connected now");
    expect(memberStatus({joined: 12, connected: false})).toBe("Not connected");
    expect(memberStatus({joined: 0})).toBe("Invited, has not joined yet");
    expect([memberStatus({joined: 3, departed: "left"}), memberStatus({joined: 3, departed: "removed"})]).toEqual(["Left the journal", "Removed by the owner"]);
});

test("a row names the member who wrote it, a former member when they are gone, and nobody for the owner", () => {
    const names = {"m-1": "Ada"};
    expect(writerOf({member: "m-1"}, names)).toBe("Ada");
    expect(writerOf({member: "m-9"}, names)).toBe("A former member");
    expect([writerOf({member: "owner"}, names), writerOf({}, names)]).toEqual([null, null]);
});

test("the owner invites a person as a reader and gets the link to send them", async () => {
    hostingMe.mockResolvedValue(OWNER);
    members.mockResolvedValue({owner: {name: "Owner", connected: true}, members: []});
    inviteMember.mockImplementation(async () => {
        members.mockResolvedValue({owner: {name: "Owner", connected: true}, members: [{id: "m-1", name: "Ada", role: "reader", joined: 0}]});
        return {member: {id: "m-1", name: "Ada"}, link: "https://journal.example.com/join?code=abc"};
    });
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    expect(document.body.textContent).toContain("No one else can log in to this journal.");
    expect(document.body.textContent).toContain("Connected now");
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
    members.mockResolvedValue({owner: {name: "Owner", connected: true}, members: [{id: "m-1", name: "Ada", role: "reader", joined: 3}]});
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
    expect(document.querySelector('[aria-label="Members"] [role="radio"]')).toBeNull();
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

test("the owner logs a member out, and removes them only after confirming", async () => {
    hostingMe.mockResolvedValue(OWNER);
    members.mockResolvedValue({owner: {name: "Owner", connected: true}, members: [{id: "m-1", name: "Ada", role: "writer", joined: 3}]});
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    pressed("Log out");
    await flush();
    expect(endLogins).toHaveBeenCalledWith("m-1");
    pressed("Remove");
    await flush();
    expect(document.body.textContent).toContain("Remove Ada?");
    expect(removeMember).not.toHaveBeenCalled();
    pressed("Remove");
    await flush();
    expect(removeMember).toHaveBeenCalledWith("m-1");
});

test("a member who leaves is sent to the login page", async () => {
    hostingMe.mockResolvedValue(READER);
    leaveJournal.mockResolvedValue({login: "/login?notice=left"});
    const open = vi.spyOn(loginPage, "open").mockImplementation(() => {});
    const into = await mounted(People);
    into.querySelector('[aria-label="People"]').click();
    await flush();
    pressed("Leave this journal");
    await flush();
    pressed("Leave");
    await flush();
    expect(open).toHaveBeenCalledWith("/login?notice=left");
});

test("the owner shares an environment with a member from the member's row", async () => {
    const {default: MemberEnvironments} = await import("../src/layout/MemberEnvironments.vue");
    const share = vi.fn();
    const into = document.createElement("div");
    document.body.append(into);
    const app = createApp(MemberEnvironments, {shared: ["main"], environments: ["main", "garden"], onShare: share});
    app.directive("tip", tip);
    app.mount(into);
    await flush();
    pressed("Environments");
    await flush();
    const garden = [...document.querySelectorAll('[role="menuitemcheckbox"]')].find((item) => item.textContent.includes("garden"));
    expect(garden.getAttribute("aria-checked")).toBe("false");
    garden.click();
    expect(share).toHaveBeenCalledWith(["main", "garden"]);
});
