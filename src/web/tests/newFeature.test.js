import {beforeEach, describe, expect, test, vi} from "vitest";

const given = {id: "squire", version: "2.9.0", title: "New chat voice: the Squire", text: "Hail!", button: "Use the Squire voice", profile: "Squire", art: "", note: "", eyebrow: "Hey, new feature"};
const asked = vi.fn();
const useProfile = vi.fn();

vi.mock("../src/api/client.js", () => ({api: {newFeature: () => asked()}}));
vi.mock("../src/composables/profiles.js", () => ({
    loadProfiles: vi.fn(),
    profiles: {value: [{n: 1, title: "Butler"}, {n: 6, title: "Squire"}]},
    profilesLoaded: {value: true},
    useProfile: (row) => useProfile(row),
}));

const {dismissNewFeature, loadNewFeature, newFeature, useNewFeature} = await import("../src/composables/newFeature.js");

beforeEach(() => {
    localStorage.clear();
    newFeature.value = null;
    asked.mockReset().mockResolvedValue(given);
    useProfile.mockReset();
});

describe("a release's new feature", () => {
    test("is shown once and not again after it was dismissed", async () => {
        await loadNewFeature();
        expect(newFeature.value.title).toBe("New chat voice: the Squire");
        dismissNewFeature();
        expect(newFeature.value).toBe(null);
        await loadNewFeature();
        expect(newFeature.value).toBe(null);
    });

    test("shows nothing when the release announces none, or the answer fails", async () => {
        asked.mockResolvedValue({});
        await loadNewFeature();
        expect(newFeature.value).toBe(null);
        asked.mockRejectedValue(new Error("down"));
        await loadNewFeature();
        expect(newFeature.value).toBe(null);
    });

    test("its button makes the voice the profile in use and counts as seen", async () => {
        await loadNewFeature();
        await useNewFeature();
        expect(useProfile).toHaveBeenCalledWith({n: 6, title: "Squire"});
        expect(newFeature.value).toBe(null);
        await loadNewFeature();
        expect(newFeature.value).toBe(null);
    });
});
