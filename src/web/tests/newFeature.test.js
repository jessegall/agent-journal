import {beforeEach, describe, expect, test, vi} from "vitest";

const first = {id: "squire", version: "2.9.0", title: "New chat voice: the Squire", text: "Hail!", button: "Use the Squire voice", profile: "Squire", art: "", note: "", eyebrow: "Hey, new feature"};
const second = {...first, id: "owl", version: "2.10.0", title: "A second feature", profile: ""};
const asked = vi.fn();
const marked = vi.fn();
const useProfile = vi.fn();

vi.mock("../src/api/client.js", () => ({api: {newFeatures: () => asked(), markNewFeatureSeen: (id) => marked(id)}}));
vi.mock("../src/composables/profiles.js", () => ({
    loadProfiles: vi.fn(),
    profiles: {value: [{n: 1, title: "Butler"}, {n: 6, title: "Squire"}]},
    profilesLoaded: {value: true},
    useProfile: (row) => useProfile(row),
}));

const {dismissNewFeature, loadNewFeatures, newFeature, useNewFeature} = await import("../src/composables/newFeature.js");

beforeEach(async () => {
    asked.mockReset().mockResolvedValue([]);
    marked.mockReset().mockResolvedValue({});
    useProfile.mockReset();
    await loadNewFeatures();
});

describe("the new features a release announces", () => {
    test("queue, oldest first as the server sends them, and each is told to the server as seen when it is dismissed", async () => {
        asked.mockResolvedValue([first, second]);
        await loadNewFeatures();
        expect(newFeature.value.id).toBe("squire");
        dismissNewFeature();
        expect([newFeature.value.id, marked.mock.calls]).toEqual(["owl", [["squire"]]]);
        dismissNewFeature();
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
});
