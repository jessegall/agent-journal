import {describe, expect, test} from "vitest";
import "../src/text/all.js";
import {render} from "../src/text/index.js";

const PASTED = `:8426/api/main/settings:1  Failed to load resource: the server responded with a status of 400 (Bad Request)
Ya.console.error @ TimingChip-JjoWLbYK.js:1
Error: Send status changes to Linear needs stage states first
    at Dp (tokens-DqtCCRaa.js:18:9388)
    at async Object.saveSettings (main-Bx1.js:2:1200)
:8426/api/main/settings:1  Failed to load resource: the server responded with a status of 400 (Bad Request)
Error: Send status changes to Linear needs stage states first
    at Dp (tokens-DqtCCRaa.js:18:9388)`;

describe("a pasted console log", () => {
    test("is one console card, never prose with code blocks cut out of it", () => {
        const html = render(PASTED);
        expect([html.match(/console-card/g)?.length, html.includes("chat-code"), html.includes("<p>")]).toEqual([1, false, false]);
    });

    test("leaves prose with one indented example as prose", () => {
        const html = render("Run it like this:\n\n    npm run build\n\nthen reload the page.");
        expect([html.includes("console-card"), html.includes("then reload the page")]).toEqual([false, true]);
    });
});
