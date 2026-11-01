import {createApp, h} from "vue";
import {expect, test} from "vitest";
import {RunningCommand} from "@journal/window-kit";

function shown(props) {
    const element = document.createElement("div");
    createApp({render: () => h(RunningCommand, props)}).mount(element);
    return element;
}

test("the running line names the command the agent runs, and shows the idle word when none runs", () => {
    expect(shown({text: "Bash pytest -q"}).querySelector("[data-running-command]").textContent).toBe("Bash pytest -q");
    expect(shown({text: "", idle: "waiting"}).querySelector("[data-running-command]").textContent).toBe("waiting");
});
