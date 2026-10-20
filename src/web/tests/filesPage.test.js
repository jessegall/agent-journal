import {expect, test, vi} from "vitest";
import {createApp, h, nextTick} from "vue";

test("the Files page lists the project's folders and files, and opening one puts its path in the address", async () => {
    window.matchMedia = window.matchMedia || (() => ({matches: false, addEventListener() {}, removeEventListener() {}}));
    const {api} = await import("../src/api/client.js");
    api.projectFiles = vi.fn(async (folder) =>
        folder === "src"
            ? [{path: "src/journal.py", name: "journal.py", folder: false, size: 10}]
            : [
                  {path: "src", name: "src", folder: true},
                  {path: "README.md", name: "README.md", folder: false, size: 20},
              ]
    );
    const {default: ProjectTree} = await import("../src/resource/ProjectTree.vue");
    const picked = [];
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(ProjectTree, {open: "", onPick: (entry) => picked.push(entry.path)})});
    app.mount(host);
    await nextTick();
    await nextTick();
    const named = () => [...host.querySelectorAll(".tree-row")].map((el) => el.textContent.trim());
    expect(named()).toEqual(["src", "README.md"]);

    host.querySelectorAll(".tree-row")[0].click();
    await nextTick();
    await nextTick();
    await nextTick();
    expect(named()).toEqual(["src", "journal.py", "README.md"]);

    [...host.querySelectorAll(".tree-row")].find((el) => el.textContent.trim() === "journal.py").click();
    expect(picked).toEqual(["src/journal.py"]);

    const {PAGES} = await import("../src/route.js");
    const {PAGES: SIDEBAR} = await import("../src/domain/navigation.js");
    expect([PAGES.includes("files"), SIDEBAR.files.title, SIDEBAR.attachments.title, PAGES.includes("code")]).toEqual([true, "Files", "Attachments", false]);

    app.unmount();
    host.remove();
});
