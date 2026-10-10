// @vitest-environment node
import {describe, expect, test, vi} from "vitest";

const calls = {profiles: 0, animations: 0};
const answer = (name, value) => () => {
    calls[name] = (calls[name] || 0) + 1;
    return new Promise((resolve) => setTimeout(() => resolve(value), 10));
};

vi.mock("../src/api/client.js", () => ({
    api: {
        profiles: answer("profiles", []),
        profileCallings: answer("callings", {}),
        profileSamples: answer("samples", {}),
        profileNamings: answer("namings", []),
        profileAnimations: answer("animations", {}),
        profileSchedules: answer("schedules", {}),
        publicUrl: (path) => path,
    },
}));

describe("loading the voice profiles", () => {
    test("a load asked for while one is in flight shares it, and a later one starts again", async () => {
        const {loadProfiles} = await import("../src/composables/profiles.js");
        await Promise.all([loadProfiles(), loadProfiles(), loadProfiles()]);
        expect([calls.profiles, calls.animations]).toEqual([1, 1]);
        await loadProfiles();
        expect([calls.profiles, calls.animations]).toEqual([2, 2]);
    });
});
