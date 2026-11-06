import {expect, test, vi} from "vitest";
import {useOutputPages} from "../src/composables/outputPages.js";
import MarkBody from "../src/chat/MarkBody.vue";
import {outputWindowContext} from "./support/outputWindowContext.js";
import Output from "../../core/modules/processes/web/src/Output.vue";
import {context, mounted, settle} from "./support/windowContext.js";

const page = (lines, first_byte, last_byte, total = last_byte) => ({ok: true, value: {lines, first_byte, last_byte, total}});

function reader(answers) {
    const reads = [];
    return {reads, read: async (words) => {
        reads.push(words.join(" "));
        return answers.shift();
    }};
}

test("the first read asks for the newest page only", async () => {
    const {read, reads} = reader([page(["b"], 2, 4)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    expect(reads).toEqual(["output page 3"]);
    expect(pages.lines.value).toEqual(["b"]);
});

test("a follow asks only for what is new and adds it", async () => {
    const {read, reads} = reader([page(["a"], 0, 2), page(["b"], 2, 4)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    await pages.follow();
    expect(reads[1]).toBe("output page 3 --after 2");
    expect(pages.lines.value).toEqual(["a", "b"]);
});

test("a file cut below what was read starts again from its newest lines", async () => {
    const {read, reads} = reader([page(["a"], 900, 1000), page([], 1000, 1000, 50), page(["kept"], 0, 50)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    await pages.follow();
    expect(reads[2]).toBe("output page 3");
    expect(pages.lines.value).toEqual(["kept"]);
});

test("near the top an earlier page goes in front and the place in the text stays", async () => {
    const {read, reads} = reader([page(["b"], 2, 4), page(["a"], 0, 2)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    const box = {scrollTop: 10, scrollHeight: 100};
    await pages.loadEarlier(box);
    expect(reads[1]).toBe("output page 3 --before 2");
    expect(pages.lines.value).toEqual(["a", "b"]);
});

test("far from the top nothing earlier is read", async () => {
    const {read, reads} = reader([page(["b"], 2, 4)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    await pages.loadEarlier({scrollTop: 500, scrollHeight: 1000});
    expect(reads).toHaveLength(1);
});

test("at the start of the output nothing earlier is read", async () => {
    const {read, reads} = reader([page(["a"], 0, 2)]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    await pages.loadEarlier({scrollTop: 0, scrollHeight: 100});
    expect(reads).toHaveLength(1);
});

test("a chat mark opens on the newest page, never the whole output", async () => {
    const window = context({"output page 3": page(["newest"], 900, 1000)});
    window.run = async (words) => {
        window.reads.push(words.join(" "));
        return page(["newest"], 900, 1000);
    };
    const element = await mounted(MarkBody, window, {declaration: {}, mark: {target_model: "process", target_id: 3, ended_at: "2026-11-04T00:00:00Z"}, shown: true});
    await settle();
    expect(window.reads).toContain("output page 3");
    expect(window.reads.some((line) => line.includes("--all"))).toBe(false);
    expect(element.textContent).toContain("newest");
});

test("the output window reads pages for the whole output, and its reader lines by summary", async () => {
    const window = outputWindowContext({
        "process feed --id 3": {ok: true, value: {rows: [{id: 3, state: "finished", line: "make"}]}},
        "output peek 3 --summary": {ok: true, value: {lines: ["read"]}},
        "output page 3": page(["newest"], 900, 1000),
    }, 3);
    window.setting = async () => 3;
    const element = await mounted(Output, window);
    await vi.waitFor(() => expect(element.textContent).toContain("read"));
    element.querySelector(".whole").click();
    await settle();
    await vi.waitFor(() => expect(window.reads).toContain("output page 3"));
    expect(window.reads.some((line) => line.includes("--all"))).toBe(false);
});

test("a failed read leaves the lines as they are", async () => {
    const {read} = reader([page(["a"], 0, 2), {ok: false, error: "gone"}]);
    const pages = useOutputPages(read, () => 3);
    await pages.follow();
    await pages.follow();
    expect(pages.lines.value).toEqual(["a"]);
});
