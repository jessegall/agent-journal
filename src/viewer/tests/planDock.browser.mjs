import assert from "node:assert/strict";
import http from "node:http";
import {chromium} from "playwright-core";

const [address, socketPath] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    await page.goto(address);
    async function run(line) {
        const answer = await new Promise((resolve, reject) => {
            const request = http.request({socketPath, path: "/cli", method: "POST"}, (response) => {
                let body = "";
                response.on("data", (chunk) => body += chunk);
                response.on("end", () => resolve({body, code: response.trailers["journal-exit-code"]}));
            });
            request.on("error", reject);
            request.end(JSON.stringify({argv: line, folder: "/"}));
        });
        assert.equal(answer.code, "0", JSON.stringify(answer));
    }
    await run(["plan", "make", "The rebuild", "--brief", "Rebuild it", "--environment", "main"]);
    const card = page.locator('.chat-dock-card[aria-label="The rebuild"]');
    await card.getByText("Planned", {exact: true}).waitFor();
    await run(["phase", "make", "--plan", "1", "Build"]);
    await card.getByText("Build", {exact: true}).waitFor();
    await run(["task", "make", "Lay the foundation", "--phase", "1", "--environment", "main"]);
    await card.getByText("Lay the foundation", {exact: true}).waitFor();
} finally {
    await browser.close();
}
