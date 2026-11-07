import {afterEach, expect, test} from "vitest";
import {mounted, settle} from "./support/windowContext.js";
import {dumpWindowContext} from "./support/dumpWindowContext.js";
import DumpRows from "../../core/modules/dumps/web/src/DumpRows.vue";

afterEach(() => (document.body.innerHTML = ""));

const FILING = {id: 2, title: "Cart notes", brief: "sort the cart notes", outcome: "", items: [
    {id: 4, text: "totals.md", state: "filed", note: "", summary: "the totals", refs: ["docs:7", "tasks:3"]},
    {id: 5, text: "ideas.md", state: "new", note: "", summary: "", refs: []},
]};
const FILED = {id: 1, title: "Old notes", brief: "sort the old notes", outcome: "2 rows filed", items: [{id: 3, text: "old.md", state: "filed", note: "", summary: "", refs: ["plans:1"]}]};

async function drawn(dumps = [FILING, FILED]) {
    const ran = [];
    const window = dumpWindowContext({"dump board": {ok: true, value: {total: dumps.length, dumps}}});
    window.run = async (line) => (ran.push(line), {ok: true, value: null});
    return {element: await mounted(DumpRows, window), ran};
}

test("the newest dump opens with its phase, the files settled and what each file became", async () => {
    const {element} = await drawn();
    const open = element.querySelector('[data-dump="2"]');
    expect(open.querySelector(".dump-title").textContent).toBe("Cart notes");
    expect(open.querySelector(".dump-pill").textContent).toBe("Filing");
    expect(open.querySelector("[data-dump-progress]").textContent).toContain("1 of 2 files settled");
    expect(open.querySelectorAll("[data-item]")).toHaveLength(2);
});

test("a dump that filed its files names each row made, its type and the file it came from", async () => {
    const {element} = await drawn();
    const made = [...element.querySelectorAll("[data-made]")].map((row) => row.textContent);
    expect(element.querySelector(".made-title").textContent).toBe("2 items created");
    expect(made[0]).toContain("Document");
    expect(made[0]).toContain("docs:7");
    expect(made[0]).toContain("From totals.md");
    expect(made[1]).toContain("Task");
});

test("an earlier dump is one line with its phase, and a click opens it in place of the open one", async () => {
    const {element} = await drawn();
    const earlier = element.querySelector('[data-dump="1"]');
    expect(earlier.tagName).toBe("BUTTON");
    expect(earlier.textContent).toContain("Old notes");
    expect(earlier.textContent).toContain("Filed");
    earlier.click();
    await settle();
    expect(element.querySelector('[data-dump="1"]').tagName).toBe("SECTION");
    expect(element.querySelector('[data-dump="1"]').textContent).toContain("Closed: 2 rows filed");
    expect(element.querySelector('[data-dump="2"]').tagName).toBe("BUTTON");
});

test("a dump still filing is renamed in its head, and a closed one offers no rename", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-dump-rename]").click();
    await settle();
    const input = element.querySelector("[data-dump-name]");
    input.value = "Cart and tax notes";
    input.dispatchEvent(new Event("input"));
    input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));
    await settle();
    expect(ran).toEqual([["dump", "name", "2", "Cart and tax notes"]]);
    element.querySelector('[data-dump="1"]').click();
    await settle();
    expect(element.querySelector("[data-dump-rename]")).toBeNull();
});
