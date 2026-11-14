import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import AgentBadge from "../src/kit/AgentBadge.vue";

afterEach(() => (document.body.innerHTML = ""));

const drawn = (props) => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(AgentBadge, props)}).mount(element);
    return element.querySelector("[data-agent-badge]");
};

test("test_chip_never_cut: a chip carries its whole name, a main agent reads main agent, and the chip class holds it from shrinking", () => {
    const chip = drawn({name: "worker-7 with a very long name", chip: true});
    expect(chip.classList.contains("chip")).toBe(true);
    expect(chip.querySelector("[data-agent-badge-name]").textContent).toBe("worker-7 with a very long name");
    expect(drawn({name: "Agent 78", main: true, chip: true}).textContent.trim()).toBe("main agent");
    expect(drawn({name: "worker-4"}).classList.contains("chip")).toBe(false);
});
