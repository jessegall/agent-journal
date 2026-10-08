// @vitest-environment node
import {describe, expect, test} from "vitest";
import {asking, complete, creating, daysLeft, drafted, handedVariable, isWaiting, keptWords, pickable, pickedBy, saved, variableOf, whenWords} from "../src/domain/secrets.js";

const row = (data, more = {}) => ({n: 1, title: "Stripe test", abstract: "", brief: "", data: {kind: "login", secret_fields: [{name: "username", hidden: false, variable: "U"}, {name: "password", hidden: true, variable: "P"}], ...data}, ...more});

describe("secrets", () => {
    test("a secret waits while any of its fields has no value", () => {
        expect(isWaiting(row({filled: {username: 1}}))).toBe(true);
        expect(isWaiting(row({filled: {username: 1, password: 2}}))).toBe(false);
    });

    test("only a waiting secret the agent asked for shows in the request band", () => {
        const asked = row({asked: "to run the payment tests"});
        const filled = row({asked: "x", filled: {username: 1, password: 2}});
        expect(asking([asked, filled, row({})])).toEqual([asked]);
    });

    test("a custom field's variable name comes from the title and the field", () => {
        expect(variableOf("Stripe test", "api key")).toBe("STRIPE_TEST_API_KEY");
    });

    test("a deleted secret says how many days it is kept", () => {
        const deleted = row({}, {deleted: 1000});
        expect(daysLeft(deleted, 1000 + 29.5 * 86400)).toBe(1);
        expect(keptWords(deleted, 1000 + 29 * 86400)).toBe("1 day left before its values are removed");
    });

    test("when words say that no value is set yet", () => {
        expect(whenWords(row({}))).toBe("No value set yet");
    });

    test("saving drops unnamed fields and gives new ones a variable", () => {
        const draft = {...drafted(null), title: " Mail ", kind: "custom", fields: [{name: "token", hidden: true, variable: ""}, {name: " ", hidden: true, variable: ""}]};
        expect(complete(draft)).toBe(true);
        expect(saved(draft).secret_fields).toEqual([{name: "token", hidden: true, variable: "MAIL_TOKEN"}]);
        expect(creating(draft).kind).toBe("custom");
        expect(creating({...draft, kind: "login"})).not.toHaveProperty("secret_fields");
    });

    test("a plugin gets the first hidden field of the secret picked for it", () => {
        const login = row({secret_fields: [{name: "username", hidden: false, variable: "U"}, {name: "password", hidden: true, variable: "P"}]});
        const shown = row({secret_fields: [{name: "name", hidden: false, variable: "N"}]});
        expect(handedVariable(login)).toBe("P");
        expect(pickable([login, shown])).toEqual([login]);
        expect(pickedBy([login, shown], "P")).toBe(login);
        expect(pickedBy([login, shown], "")).toBeNull();
    });
});
