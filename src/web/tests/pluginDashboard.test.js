import {createApp, h} from "vue";
import {expect, test, vi} from "vitest";

const DOCUMENT = {
    start: "start",
    pages: {
        start: {
            title: "Echoes",
            view: {
                type: "stack",
                children: [
                    {type: "heading", text: "Files", level: 3},
                    {
                        type: "list",
                        items: [
                            {label: "a.py", badge: "1 sin", tone: "warn", note: ""},
                            {label: "b.py", badge: "clean", tone: "good", note: ""},
                        ],
                    },
                ],
            },
        },
    },
};

test("a plugin's dashboard is drawn from the lines the plugin wrote, under their heading", async () => {
    const {default: Dashboard} = await import("../src/kit/Dashboard.vue");
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(Dashboard, {document: DOCUMENT})});
    app.mount(host);
    await vi.waitFor(() => expect(host.querySelectorAll(".list-item").length).toBe(2));
    const lines = [...host.querySelectorAll(".list-item")].map((e) => [e.querySelector(".list-label").textContent, e.querySelector(".badge").textContent.trim()]);
    expect([host.querySelector("h3").textContent, lines]).toEqual(["Files", [["a.py", "1 sin"], ["b.py", "clean"]]]);
    app.unmount();
    host.remove();
});
