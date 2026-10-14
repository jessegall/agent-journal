import {describe, expect, test} from "vitest";
import {markerTone, markerWords, sizeWords, stepWords, travelsLine} from "../src/domain/connection.js";

describe("what connecting to a server would send", () => {
    test("sizes are told in the unit a person reads", () => {
        expect([sizeWords(500), sizeWords(2048), sizeWords(1363148)]).toEqual(["500 bytes", "2 KB", "1.3 MB"]);
    });

    test("the line says how many files and environments travel and that keys and phones stay", () => {
        expect(travelsLine({files: 214, bytes: 1363148, environments: ["a", "b", "c"]})).toBe(
            "Connecting sends 214 files (1.3 MB) from 3 environments. Keys, tokens, phones and live state stay on this machine."
        );
        expect(travelsLine({files: 1, bytes: 10, environments: ["a"]})).toContain("1 file (10 bytes) from 1 environment.");
    });

    test("a copy in step, behind or on another epoch is told in plain words", () => {
        expect([stepWords("in step"), stepWords("upgrade here"), stepWords("pull again"), stepWords("")]).toEqual([
            "In step with the server.",
            "This copy has to upgrade before it can sync.",
            "The server's record started again, so this copy pulls everything afresh.",
            "",
        ]);
    });

    test("a marker says which journal this is, how it stands and when it last synced", () => {
        const ago = (at) => `${at} ago`;
        expect(markerWords({role: "your copy", step: "in step", synced_at: 120}, ago)).toBe("Your copy · in step · synced 120 ago");
        expect(markerWords({role: "the server", step: "", synced_at: 0}, ago)).toBe("The server · not synced yet");
        expect(markerWords({role: "", step: "in step", synced_at: 5}, ago)).toBe("");
        expect([markerTone({step: "in step"}), markerTone({step: "upgrade here"})]).toEqual(["good", "warn"]);
    });
});
