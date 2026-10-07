import {createApp, nextTick} from "vue";
import {beforeEach, expect, test, vi} from "vitest";

const command = vi.fn();
const act = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {command: (...a) => command(...a), act: (...a) => act(...a), create: vi.fn()}}));
vi.mock("../src/sync/rows.js", () => ({rows: () => []}));

const {default: ChoiceCard} = await import("../src/resource/ChoiceCard.vue");

const flush = async () => {
    for (let i = 0; i < 5; i++) await nextTick();
};
const report = {
    ref: "report:5",
    type: "report",
    n: 5,
    data: {
        buttons: [
            {label: "Ship it", choice: "go", type: "todo", action: "done", n: 1},
            {label: "Hold it", choice: "go", type: "todo", action: "block", n: 1},
        ],
    },
};

function shown() {
    const into = document.createElement("div");
    document.body.append(into);
    createApp(ChoiceCard, {resource: report}).mount(into);
    const button = (label) => [...into.querySelectorAll("button")].find((b) => b.textContent.includes(label));
    return {into, button};
}

beforeEach(() => {
    document.body.innerHTML = "";
    command.mockReset();
    act.mockReset().mockResolvedValue({});
});

test("a pressed option shows a spinner and disables the others before the server answers", async () => {
    let finish;
    act.mockReturnValueOnce(new Promise((done) => (finish = done)));
    const {into, button} = shown();
    button("Ship it").click();
    await flush();
    expect(button("Ship it").querySelector(".spinner, [class*=spin]")).not.toBeNull();
    expect(button("Hold it").disabled).toBe(true);
    expect(button("Ship it").disabled).toBe(true);
    finish({});
    await flush();
    expect(into.querySelector(".error")).toBeNull();
});

test("a failed press restores the options and says the error plainly", async () => {
    act.mockRejectedValueOnce(new Error("The server is down"));
    const {into, button} = shown();
    button("Hold it").click();
    await flush();
    expect(button("Hold it").disabled).toBe(false);
    expect(button("Ship it").disabled).toBe(false);
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
