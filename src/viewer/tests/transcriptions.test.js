import {expect, test} from "vitest";
import {context, mounted, settle} from "./support/windowContext.js";
import TranscriptionRows from "../../core/modules/transcriptions/web/src/TranscriptionRows.vue";

const MEETING = {id: 4, title: "Cart meeting", text: "Ada: the cart rounds twice.", source: "", created_at: "2026-11-02T10:00:00Z"};

function page({sources = []} = {}) {
    const ran = [];
    const window = context({}, null, {
        transcriptions: {line: "transcription list", events: ["transcription.*"]},
        sources: {line: "transcription sources"},
        "links.*": {line: "link list --row transcription:{id} --group-counterparts", loading: "requested"},
    });
    window.read = async (line) => {
        const words = Array.isArray(line) ? line.join(" ") : line;
        if (words.startsWith("transcription sources")) return {ok: true, value: {rows: sources}};
        if (words.startsWith("link list")) return {ok: true, value: {rows: [], counterparts: [{endpoint: {model: "doc", id: 3, title: "doc 3", exists: true, unavailable: false, open_ref: "docs:3"}, relations: ["about"], link_ids: [1]}], total: 1}};
        return {ok: true, value: {rows: [MEETING]}};
    };
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {window, ran};
}

test("a pasted transcription is saved with its title and text", async () => {
    const {window, ran} = page();
    const element = await mounted(TranscriptionRows, window);
    await settle();
    element.querySelector("[data-transcription-new]").click();
    await settle();
    const form = element.querySelector("[data-transcription-form]");
    form.querySelector("input").value = "Standup";
    form.querySelector("input").dispatchEvent(new Event("input"));
    form.querySelector("textarea").value = "Ada: all good.";
    form.querySelector("textarea").dispatchEvent(new Event("input"));
    await settle();
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(ran).toContainEqual(["transcription", "make", "Standup", "--text", "Ada: all good."]);
});

test("opening a transcription shows what was made from it and saves an edit", async () => {
    const {window, ran} = page();
    const element = await mounted(TranscriptionRows, window);
    await settle();
    element.querySelector("[data-transcription='4']").click();
    await settle();
    expect(element.querySelector("[data-transcription-link]").textContent).toContain("doc 3");
    const text = element.querySelector("[data-transcription-opened] textarea");
    text.value = "Ada: the cart rounds once.";
    text.dispatchEvent(new Event("input"));
    await settle();
    element.querySelector("[data-transcription-save]").click();
    await settle();
    expect(ran).toContainEqual(["transcription", "edit", "4", "--text", "Ada: the cart rounds once."]);
});

test("the fetch button shows only for a connected server with transcripts", async () => {
    const none = await mounted(TranscriptionRows, page().window);
    await settle();
    expect(none.querySelector("[data-transcription-fetch]")).toBeNull();
    const {window, ran} = page({sources: [{name: "wispr-flow", title: "Wispr Flow"}]});
    const element = await mounted(TranscriptionRows, window);
    await settle();
    const button = element.querySelector("[data-transcription-fetch='wispr-flow']");
    expect(button.textContent).toContain("Fetch transcriptions from Wispr Flow");
    button.click();
    await settle();
    expect(ran).toContainEqual(["transcription", "fetch", "wispr-flow"]);
});
