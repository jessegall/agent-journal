import {createApp} from "vue";
import {beforeEach, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

const press = vi.fn();
const pressed = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {press: (...a) => press(...a), pressed: (...a) => pressed(...a)}}));

const {default: ChoiceCard} = await import("../src/resource/ChoiceCard.vue");

const asked = {
    table: "messages",
    id: 5,
    author: "agent",
    text: "May I share docs:1?",
    data: {
        buttons: [
            {label: "Accept", path: "/shares/1/approve"},
            {label: "Deny", path: "/shares/1/stop"},
        ],
    },
};

function shown() {
    const into = document.createElement("div");
    document.body.append(into);
    createApp(ChoiceCard, {message: asked}).mount(into);
    const button = (label) => [...into.querySelectorAll("button")].find((b) => b.textContent.includes(label));
    return {into, button};
}

beforeEach(() => {
    document.body.innerHTML = "";
    press.mockReset().mockResolvedValue({});
    pressed.mockReset().mockResolvedValue({});
});

test("a pressed button shows a spinner and disables the others before the server answers, then records what was pressed", async () => {
    let finish;
    press.mockReturnValueOnce(new Promise((done) => (finish = done)));
    const {into, button} = shown();
    button("Accept").click();
    await flush();
    expect(press).toHaveBeenCalledWith(asked.data.buttons[0]);
    expect(button("Accept").querySelector(".spinner, [class*=spin]")).not.toBeNull();
    expect(button("Deny").disabled).toBe(true);
    finish({});
    await flush();
    expect(pressed).toHaveBeenCalledWith(5, ["Accept"]);
    expect(into.querySelector(".error")).toBeNull();
});

test("a failed press restores the buttons and says the error plainly", async () => {
    press.mockRejectedValueOnce(new Error("The server is down"));
    const {into, button} = shown();
    button("Deny").click();
    await flush();
    expect(button("Deny").disabled).toBe(false);
    expect(button("Accept").disabled).toBe(false);
    expect(into.querySelector(".error").textContent).toContain("The server is down");
});

test("a pressed question option shows a spinner and the others wait before the answer is sent, and a failure restores them", async () => {
    const {default: OptionList} = await import("../src/kit/OptionList.vue");
    let fail;
    const send = vi.fn(() => new Promise((_, reject) => (fail = reject)));
    const into = document.createElement("div");
    document.body.append(into);
    createApp(OptionList, {options: [{title: "Yes"}, {title: "No"}], send, immediate: true}).mount(into);
    const button = (label) => [...into.querySelectorAll("button")].find((b) => b.textContent.includes(label));
    button("Yes").click();
    await flush();
    expect(send).toHaveBeenCalledWith("Yes");
    expect(button("Yes").querySelector(".spinner")).not.toBeNull();
    expect(button("No").disabled).toBe(true);
    fail(new Error("down"));
    await flush();
    expect(button("Yes").querySelector(".spinner")).toBeNull();
    expect(button("No").disabled).toBe(false);
});
