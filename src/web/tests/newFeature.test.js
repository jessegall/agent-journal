import {beforeEach, describe, expect, test, vi} from "vitest";

const first = {id: "squire", version: "2.9.0", title: "New chat voice: the Squire", text: "Hail!", button: "Use the Squire voice", profile: "Squire", art: "", note: "", eyebrow: "Hey, new feature"};
const second = {...first, id: "owl", version: "2.10.0", title: "A second feature", profile: "", art: "announcements/owl.png"};
const asked = vi.fn();
const marked = vi.fn();
const useProfile = vi.fn();
const reported = vi.fn();

vi.mock("../src/api/client.js", () => ({
    api: {newFeatures: () => asked(), markNewFeatureSeen: (id) => marked(id), publicUrl: (path) => `/${path}`},
}));
vi.mock("../src/platform/faults.js", () => ({report: (...args) => reported(...args)}));
vi.mock("../src/composables/profiles.js", () => ({
    loadProfiles: vi.fn(),
    profiles: {value: [{n: 1, title: "Butler"}, {n: 6, title: "Squire"}]},
    profilesLoaded: {value: true},
    useProfile: (row) => useProfile(row),
}));

const {UNSENT_KEY, dismissNewFeature, loadNewFeatures, newFeature, useNewFeature} = await import("../src/composables/newFeature.js");

beforeEach(async () => {
    localStorage.clear();
    asked.mockReset().mockResolvedValue([]);
    marked.mockReset().mockResolvedValue({});
    reported.mockReset();
    useProfile.mockReset();
    await loadNewFeatures();
});

describe("the new features a release announces", () => {
    test("queue, oldest first as the server sends them, and each is told to the server as seen when it is dismissed", async () => {
        asked.mockResolvedValue([first, second]);
        await loadNewFeatures();
        expect(newFeature.value.id).toBe("squire");
        await dismissNewFeature();
        expect([newFeature.value.id, marked.mock.calls]).toEqual(["owl", [["squire"]]]);
        await dismissNewFeature();
        expect([newFeature.value, marked.mock.calls]).toEqual([null, [["squire"], ["owl"]]]);
    });

    test("show nothing when the server has none unseen, or cannot answer", async () => {
        await loadNewFeatures();
        expect(newFeature.value).toBe(null);
        asked.mockRejectedValue(new Error("down"));
        await loadNewFeatures();
        expect(newFeature.value).toBe(null);
    });

    test("have a button that makes the voice the profile in use, counts as seen and moves on to the next", async () => {
        asked.mockResolvedValue([first, second]);
        await loadNewFeatures();
        await useNewFeature();
        expect([useProfile.mock.calls, marked.mock.calls, newFeature.value.id]).toEqual([[[{n: 6, title: "Squire"}]], [["squire"]], "owl"]);
    });

    test("count the button as seen even when applying the voice fails, and Not now, Escape and closing count the same", async () => {
        asked.mockResolvedValue([first]);
        await loadNewFeatures();
        useProfile.mockRejectedValue(new Error("settings did not save"));
        await expect(useNewFeature()).rejects.toThrow("settings did not save");
        expect([newFeature.value, marked.mock.calls]).toEqual([null, [["squire"]]]);
    });

    test("leave the queue the moment one is dismissed, before the server has answered", async () => {
        asked.mockResolvedValue([first, second]);
        await loadNewFeatures();
        marked.mockReturnValue(new Promise(() => {}));
        dismissNewFeature();
        expect(newFeature.value.id).toBe("owl");
    });

    test("report a seen that could not be sent, keep it, and send it again before the next list so it never shows twice", async () => {
        asked.mockResolvedValue([first]);
        await loadNewFeatures();
        marked.mockRejectedValue(new Error("the server refused"));
        await dismissNewFeature();
        expect([reported.mock.calls[0].slice(0, 3), JSON.parse(localStorage.getItem(UNSENT_KEY))]).toEqual([
            ["threw", "the server refused", "POST /api/new-feature"],
            ["squire"],
        ]);
        marked.mockReset().mockResolvedValue({});
        asked.mockResolvedValue([]);
        await loadNewFeatures();
        expect([marked.mock.calls, newFeature.value, JSON.parse(localStorage.getItem(UNSENT_KEY))]).toEqual([[["squire"]], null, []]);
    });

    test("carry the artwork as a ready address", async () => {
        asked.mockResolvedValue([second]);
        await loadNewFeatures();
        expect(newFeature.value.art).toBe("/announcements/owl.png");
    });
});
