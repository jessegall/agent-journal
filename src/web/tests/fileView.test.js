import {createApp, h} from "vue";
import {afterEach, describe, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));

const {api} = await import("../src/api/client.js");
const {isPicture, isText} = await import("../src/format/files.js");
const {ui} = await import("../src/state/ui.js");
const {openFiles} = await import("../src/platform/view.js");
const {default: FileView} = await import("../src/kit/FileView.vue");
const {default: Lightbox} = await import("../src/kit/Lightbox.vue");
const {default: ResourceFiles} = await import("../src/resource/ResourceFiles.vue");

const bytes = (...values) => new Uint8Array(values).buffer;
const words = (text) => new TextEncoder().encode(text).buffer;
let app = null;

async function shown(component, props = {}) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(component, props)});
    app.mount(host);
    await flush();
    return host;
}

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
    ui.lightbox.files = [];
    ui.lightbox.at = -1;
    vi.restoreAllMocks();
});

describe("a file drawn by its kind", () => {
    test("png, jpg, gif, webp and svg are pictures, and bytes are text only when they read as UTF-8 with no NUL", () => {
        expect(["a.png", "b.JPG", "c.jpeg", "d.gif", "e.webp", "f.svg"].every(isPicture)).toBe(true);
        expect(isPicture("notes.txt")).toBe(false);
        expect(isText(words("# Notes\nhello"))).toBe(true);
        expect(isText(bytes(0x89, 0x50, 0x4e, 0x47, 0x00, 0x01))).toBe(false);
        expect(isText(bytes(0xff, 0xfe, 0xfd))).toBe(false);
    });

    test("a picture is an image of the file with its name, and its bytes are never read", async () => {
        const read = vi.spyOn(api, "fileBytes");
        const host = await shown(FileView, {name: "diagram.svg", url: "/journal/messages/3/files/diagram.svg?env=main"});
        expect(host.querySelector("img").getAttribute("src")).toBe("/journal/messages/3/files/diagram.svg?env=main");
        expect(host.querySelector(".name").textContent).toBe("diagram.svg");
        expect(host.querySelector("pre")).toBeNull();
        expect(read).not.toHaveBeenCalled();
    });

    test("text read from the file is shown as text", async () => {
        vi.spyOn(api, "fileBytes").mockResolvedValue(words("line one\nline two"));
        const host = await shown(FileView, {name: "notes.md", url: "/journal/dumps/2/files/notes.md?env=main"});
        expect(host.querySelector("pre").textContent).toBe("line one\nline two");
        expect(host.querySelector(".name").textContent).toBe("notes.md");
    });

    test("text the caller already holds is shown without reading the file again", async () => {
        const read = vi.spyOn(api, "fileBytes");
        const host = await shown(FileView, {name: "hello.py", url: "/journal/project-files/raw?path=hello.py", text: "print('hi')"});
        expect(host.querySelector("pre").textContent).toBe("print('hi')");
        expect(read).not.toHaveBeenCalled();
    });

    test("a file that is neither text nor a picture is named and offered for download, its bytes never printed", async () => {
        vi.spyOn(api, "fileBytes").mockResolvedValue(bytes(0x50, 0x4b, 0x03, 0x04, 0x00, 0x00));
        const host = await shown(FileView, {name: "archive.zip", url: "/journal/messages/3/files/archive.zip?env=main"});
        expect(host.querySelector("pre")).toBeNull();
        expect(host.querySelector(".note").textContent).toContain("archive.zip is not text or a picture, so it is not shown here.");
        expect(host.querySelector(".note a").getAttribute("download")).toBe("archive.zip");
    });
});

describe("opening a file", () => {
    test("the file opened over the page is drawn by the same view, text as text", async () => {
        vi.spyOn(api, "fileBytes").mockResolvedValue(words("the log"));
        const host = await shown(Lightbox);
        openFiles([{name: "run.log", url: "/journal/messages/3/files/run.log?env=main"}], 0);
        await flush();
        await flush();
        expect(host.querySelector(".lightbox .file-view pre").textContent).toBe("the log");
        expect(host.querySelector(".lightbox .file-view .name").textContent).toBe("run.log");
    });

    test("a row's file opens in the viewer among the row's other files, never in a new tab", async () => {
        const host = await shown(ResourceFiles, {resource: {table: "tasks", id: 4, files: ["shot.png", "notes.txt"]}});
        const link = [...host.querySelectorAll("a.file")].find((a) => a.textContent.includes("notes.txt"));
        expect(link.getAttribute("target")).toBeNull();
        link.click();
        expect(ui.lightbox.files.map((f) => f.name)).toEqual(["shot.png", "notes.txt"]);
        expect(ui.lightbox.at).toBe(1);
    });
});
