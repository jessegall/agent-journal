import {reply, runScenarios} from "./harness.mjs";

const TOTAL = {all: 130, images: 5, other: 125};
const PAGE = 60;
const file = (n, image) => ({type: "message", n: 1, title: "a message", name: `file-${n}.${image ? "png" : "txt"}`, description: "", size: 1, at: Date.now() / 1000 - n, image, url: `/api/main/message/1/files/file-${n}`});

await runScenarios(process.argv[2], {
    async "the Files page shows a skeleton, then one page, and each tab asks for its own pages"(page, url) {
        const asked = [];
        const seen = [];
        page.on("request", (request) => request.url().includes("files") && seen.push(request.url().replace(/^https?:\/\/[^/]+/, "")));
        let release;
        const held = new Promise((open) => (release = open));
        await page.route(/\/api\/main\/files\/page/, async (route) => {
            const query = new URL(route.request().url()).searchParams;
            const kind = query.get("kind");
            const skip = Number(query.get("skip") || 0);
            asked.push(`${kind}:${skip}`);
            if (asked.length === 1) await held;
            const files = Array.from({length: Math.min(PAGE, TOTAL[kind] - skip)}, (_, i) => file(skip + i, kind === "images"));
            reply(route, {files, more: skip + files.length < TOTAL[kind], found: TOTAL[kind], counts: {...TOTAL, shelves: {message: TOTAL[kind]}}});
        });
        await page.goto(`${url}#/main/files`);
        await page.locator(".files .bar").first().waitFor();
        if (await page.getByText("file-0.txt").count()) throw new Error("files showed before the server answered");
        release();
        await page.getByText("file-0.txt").first().waitFor().catch(async (error) => {
            (await import("node:fs")).writeFileSync("/private/tmp/claude-501/-Users-jessegall-projects-agent-journal--claude-worktrees-quiet-restart/cfe2f54f-2c1d-448d-b19f-f42ea1a6c866/scratchpad/diag.txt", `no file showed; asked ${asked.join()}; requests ${seen.join(" ")}; ${error.message.split("\n")[0]}`);
            throw error;
        });
        if (await page.getByText("file-60.txt").count()) throw new Error("the second page came with the first");
        await page.getByRole("button", {name: "Load more"}).first().click();
        await page.getByText("file-60.txt").first().waitFor();
        await page.getByText("Images 5", {exact: true}).first().click();
        await page.getByText("file-0.png").first().waitFor();
        if (asked.join() !== "all:0,all:60,images:0") throw new Error(`the page asked ${asked.join()}`);
    },
});
