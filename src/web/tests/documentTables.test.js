import {expect, test} from "vitest";
import {createApp, h, nextTick} from "vue";
import {compileStyle, parse} from "vue/compiler-sfc";
import TextDisplay from "../src/kit/TextDisplay.vue";
import source from "../src/kit/TextDisplay.vue?raw";

test("a wide document table keeps readable columns and scrolls inside its block", async () => {
    const headings = ["Provider", "SessionAttribution", "Lifecycle", "Status", "Outcome", "Description"];
    const description = "A long description with many words that must not squeeze the earlier columns into a few characters.";
    const text = [
        `| ${headings.join(" | ")} |`,
        `| ${headings.map(() => "---").join(" | ")} |`,
        `| Codex | development | Running | Online | Pending | ${description} |`,
    ].join("\n");
    const host = document.createElement("div");
    const style = document.createElement("style");
    const {descriptor} = parse(source);
    // jsdom has no layout; load the component's compiled CSS to check intrinsic sizing and overflow rules.
    style.textContent = compileStyle({source: descriptor.styles[0].content, id: TextDisplay.__scopeId, scoped: true}).code;
    document.head.appendChild(style);
    document.body.appendChild(host);
    const app = createApp({render: () => h("article", {style: {width: "320px", overflowWrap: "anywhere"}}, [h(TextDisplay, {text})])});

    try {
        app.mount(host);
        await nextTick();
        const table = host.querySelector(".md > table");
        expect([...table.querySelectorAll("th")].map((cell) => cell.textContent)).toEqual(headings);
        expect(table.querySelector("tbody").textContent).toContain(description);
        expect(getComputedStyle(table)).toMatchObject({display: "block", width: "100%", maxWidth: "100%", overflowX: "auto"});
        for (const cell of table.querySelectorAll("th, td")) {
            expect(getComputedStyle(cell)).toMatchObject({minWidth: "8rem", overflowWrap: "normal"});
        }
    } finally {
        app.unmount();
        host.remove();
        style.remove();
    }
});
