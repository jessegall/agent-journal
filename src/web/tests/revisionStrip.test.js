import {createApp, h} from "vue";
import {afterEach, describe, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

const {useDocRevisions} = await import("../src/composables/docRevisions.js");
const {default: RevisionStrip} = await import("../src/resource/RevisionStrip.vue");

const now = Date.now() / 1000;
const revision = (number, body, more = {}) => ({
    table: "doc_revisions",
    id: number,
    number,
    title: "Plan of record",
    abstract: "",
    body,
    change: number === 1 ? "written" : "rewrote Goals",
    closes_at: 0,
    creator: "agent:s1",
    created_at: new Date((now - 3600) * 1000).toISOString(),
    updated_at: new Date((now - 3600) * 1000).toISOString(),
    ...more,
});
const REVISIONS = [
    revision(1, "## Goals\n\nShip it\n\n## Risks\n\nNone"),
    revision(2, "## Goals\n\nShip it soon\n\n## Risks\n\nNone"),
    revision(3, "## Goals\n\nShip it now\n\n## Plan\n\nTag it", {change: "rewrote Goals; added Plan; cut Risks", closes_at: now + 600}),
];
let app = null;

async function shown() {
    const client = {docRevisions: vi.fn().mockResolvedValue(REVISIONS), keepDoc: vi.fn().mockResolvedValue({})};
    let revisions = null;
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({
        setup() {
            revisions = useDocRevisions(() => ({table: "docs", id: 4, updated_at: "2026-10-21T10:00:00+00:00"}), client);
            return () => h(RevisionStrip, {revisions});
        },
    });
    app.mount(host);
    await flush();
    return {host, client, revisions};
}

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
});

describe("the revision strip above a document", () => {
    test("opens on the newest revision, open for edits, with a tick for each and Keep this revision", async () => {
        const {host, client} = await shown();
        expect(host.querySelectorAll(".tick")).toHaveLength(3);
        expect(host.querySelector(".tick.open.current")).not.toBeNull();
        expect(host.querySelector(".count").textContent).toBe("Revision 3 of 3");
        expect(host.querySelector(".note").textContent).toContain(
            "Being edited - kept as one revision in 10 min · rewrote Goals; added Plan; cut Risks · the agent"
        );
        [...host.querySelectorAll("button")].find((b) => b.textContent.trim() === "Keep this revision").click();
        await flush();
        expect(client.keepDoc).toHaveBeenCalledWith(4);
    });

    test("steps back to an earlier revision, offers Latest, and shows its changes section by section", async () => {
        const {host, revisions} = await shown();
        host.querySelector('[title="Earlier revision"]').click();
        await flush();
        expect(host.querySelector(".count").textContent).toBe("Revision 2 of 3");
        expect([...host.querySelectorAll("button")].map((b) => b.textContent.trim())).toEqual(
            expect.arrayContaining(["Show changes", "Latest"])
        );
        expect(host.textContent).not.toContain("Keep this revision");
        revisions.go(2);
        revisions.changes = true;
        await flush();
        expect(revisions.parts.map((p) => [p.title, p.kind])).toEqual([
            ["Goals", "changed"],
            ["Plan", "added"],
            ["Risks", "removed"],
        ]);
        expect(revisions.parts[0].lines.map((l) => [l.kind, l.text])).toEqual([
            ["removed", "Ship it soon"],
            ["added", "Ship it now"],
        ]);
    });
});
