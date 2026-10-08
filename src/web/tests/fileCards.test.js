import {describe, expect, test, vi} from "vitest";

vi.mock("../src/sync/rows.js", () => ({
    rows: (type) => (type === "message" ? [{n: 17785, data: {files: {"IMG_1201.png": "", "notes.txt": ""}}}] : []),
}));

const {render} = await import("../src/text/index.js");
await import("../src/text/all.js");

const context = {types: [{name: "message", title: "Message"}], env: "main"};

describe("a file the agent names", () => {
    test("shows the picture of an attachment named on a line of its own", () => {
        const html = render("Here is the screen:\nmessage 17785 IMG_1201.png\nIt is cut off.", context);
        expect(html).toContain('<img class="file-card-image" src="');
        expect(html).toContain("/main/message/17785/files/IMG_1201.png");
        expect(html).toContain("Here is the screen:");
    });

    test("shows the picture when the server has already turned the message number into a marker", () => {
        const html = render("[[chip message:17785|message 17785]] IMG_1201.png", context);
        expect(html).toContain('<img class="file-card-image" src="');
    });

    test("shows a file that is not a picture as a card with its name", () => {
        const html = render("message 17785 notes.txt", context);
        expect(html).not.toContain("<img");
        expect(html).toContain("Message 17785 · notes.txt");
    });

    test("leaves a name the message does not hold as plain text", () => {
        expect(render("message 17785 other.png", context)).not.toContain("file-card");
    });

    test("shows a file path the server has already turned into a marker as a card", () => {
        const html = render("[[file /Users/me/project/src/app.py|src/app.py]]", context);
        expect(html).toContain('data-file="/Users/me/project/src/app.py"');
    });

    test("shows a file path on a line of its own as a card that opens the file", () => {
        const html = render("/Users/me/project/src/app.py", context);
        expect(html).toContain('data-file="/Users/me/project/src/app.py"');
        expect(html).toContain("app.py");
    });
});
