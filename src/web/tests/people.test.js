import {createApp, nextTick} from "vue";
import {beforeEach, expect, test, vi} from "vitest";
import {tip} from "../src/kit/tip.js";

const hostingMe = vi.fn();
const members = vi.fn();
const inviteMember = vi.fn();
vi.mock("../src/api/client.js", () => ({
    api: {hostingMe: (...a) => hostingMe(...a), members: (...a) => members(...a), inviteMember: (...a) => inviteMember(...a)},
    onWrite: vi.fn(),
}));

const {default: People} = await import("../src/layout/People.vue");
const {memberStatus} = await import("../src/domain/members.js");

const flush = async () => {
    for (let i = 0; i < 6; i++) await nextTick();
};

async function mounted() {
    const into = document.createElement("div");
    document.body.append(into);
    const app = createApp(People);
    app.directive("tip", tip);
    app.mount(into);
    await flush();
    return into;
}

beforeEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
});

test("a member reads as joined or as invited and not joined yet", () => {
    expect(memberStatus({joined: 12})).toBe("Joined");
    expect(memberStatus({joined: 0})).toBe("Invited, has not joined yet");
});

test("the owner invites a person by name and gets the link to send them", async () => {
    hostingMe.mockResolvedValue({member: "owner", name: "Owner", owner: true});
    members.mockResolvedValueOnce({members: []}).mockResolvedValue({members: [{id: "m-1", name: "Ada", joined: 0}]});
    inviteMember.mockResolvedValue({member: {id: "m-1", name: "Ada"}, link: "https://journal.example.com/join?code=abc"});
    const into = await mounted();
    into.querySelector('[aria-label="People"]').click();
    await flush();
    expect(document.body.textContent).toContain("Only you can log in to this journal.");
    const field = document.querySelector("#invite-name");
    field.value = "Ada";
    field.dispatchEvent(new Event("input"));
    await flush();
    [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Invite").click();
    await flush();
    expect(inviteMember).toHaveBeenCalledWith("Ada");
    expect(document.body.textContent).toContain("Send this link to Ada.");
    expect(document.body.textContent).toContain("Invited, has not joined yet");
});

test("a member's own login shows no People button", async () => {
    hostingMe.mockResolvedValue({member: "m-1", name: "Ada", owner: false});
    const into = await mounted();
    expect(into.querySelector('[aria-label="People"]')).toBeNull();
});
