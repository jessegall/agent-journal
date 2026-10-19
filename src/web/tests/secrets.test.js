// @vitest-environment node
import {describe, expect, test} from "vitest";
import {allowedProgram, asking, complete, creating, daysLeft, drafted, handedVariable, isWaiting, keptWords, pickable, pickedBy, programsKept, saved, variableOf, whenWords} from "../src/domain/secrets.js";

const at = (seconds) => new Date(seconds * 1000).toISOString();
const FIELDS = [
    {name: "username", hidden: false, variable: "U"},
    {name: "password", hidden: true, variable: "P"},
];
const row = (more = {}) => ({table: "secrets", id: 1, title: "Stripe test", brief: "", kind: "login", fields: FIELDS, filled: [], programs: [], proposed: [], helpers: false, asked_at: null, used_at: null, session_at: null, logging_in_at: null, deleted_at: null, ...more});

describe("secrets", () => {
    test("a secret waits while any of its fields has no value", () => {
        expect(isWaiting(row({filled: ["username"]}))).toBe(true);
        expect(isWaiting(row({filled: ["username", "password"]}))).toBe(false);
    });

    test("only a waiting secret the agent asked for shows in the request band", () => {
        const asked = row({asked_at: at(5)});
        const filled = row({asked_at: at(5), filled: ["username", "password"]});
        expect(asking([asked, filled, row()])).toEqual([asked]);
    });

    test("a custom field's variable name comes from the title and the field", () => {
        expect(variableOf("Stripe test", "api key")).toBe("STRIPE_TEST_API_KEY");
    });

    test("a deleted secret says how many days it is kept", () => {
        const deleted = row({deleted_at: at(1000)});
        expect(daysLeft(deleted, 1000 + 29.5 * 86400)).toBe(1);
        expect(keptWords(deleted, 1000 + 29 * 86400)).toBe("1 day left before its values are removed");
    });

    test("when words say how many values are set", () => {
        expect(whenWords(row())).toBe("No value set yet");
        expect(whenWords(row({filled: ["username"]}))).toBe("1 of 2 values set");
    });

    test("a browser login says a browser is open while the user logs in", () => {
        expect(whenWords(row({kind: "browser login"}))).toBe("Not logged in yet");
        expect(whenWords(row({kind: "browser login", logging_in_at: at(1000)}))).toBe("A browser is open for you to log in");
        expect(whenWords(row({kind: "browser login", session_at: at(1000)}))).toContain("Logged in");
    });

    test("saving drops unnamed fields and gives new ones a variable", () => {
        const draft = {...drafted(null), title: " Mail ", kind: "custom", fields: [{name: "token", hidden: true, variable: ""}, {name: " ", hidden: true, variable: ""}]};
        expect(complete(draft)).toBe(true);
        expect(saved(draft).fields).toEqual([{name: "token", hidden: true, variable: "MAIL_TOKEN"}]);
        expect(creating(draft).kind).toBe("custom");
        expect(creating({...draft, kind: "login"})).not.toHaveProperty("fields");
    });

    test("a plugin gets the first hidden field of the secret picked for it", () => {
        const login = row();
        const shown = row({fields: [{name: "name", hidden: false, variable: "N"}]});
        expect(handedVariable(login)).toBe("P");
        expect(pickable([login, shown])).toEqual([login]);
        expect(pickedBy([login, shown], "P")).toBe(login);
        expect(pickedBy([login, shown], "")).toBeNull();
    });

    test("allowing a proposed program moves it into the programs the secret may go to", () => {
        const draft = drafted(row({programs: ["gh"], proposed: ["curl", "gh"]}));
        allowedProgram(draft, "curl");
        allowedProgram(draft, "gh");
        expect(saved(draft).programs).toEqual(["gh", "curl"]);
        expect(saved(draft).proposed).toEqual([]);
    });
});

describe("a grant the server did not keep", () => {
    test("is noticed from the row the server answered, never taken for saved", () => {
        const draft = {programs: ["curl"]};
        expect(programsKept(draft, row({programs: ["curl"]}))).toBe(true);
        expect(programsKept(draft, row({proposed: ["curl"]}))).toBe(false);
        expect(programsKept(draft, null)).toBe(false);
    });
});
