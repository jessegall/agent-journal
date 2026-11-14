import {chromium} from "playwright-core";

const [address] = process.argv.slice(2);
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH, headless: true});
try {
    const page = await browser.newPage({viewport: {width: 1280, height: 960}});
    page.on("pageerror", (error) => process.stdout.write(`${error.message}\n`));
    await page.goto(address);
    const mark = page.locator(".history .mark", {hasText: "build"}).locator(".top").first();
    await mark.waitFor();
    for (let round = 0; round < 4; round++) {
        await mark.click();
        const saved = await page.waitForResponse((response) => response.request().postData()?.includes("record-mark-motion"), {timeout: 4000});
        const posted = JSON.parse(saved.request().postData());
        const line = posted.line ?? posted.lines.find((entry) => entry.line[1] === "record-mark-motion").line;
        const [{frames}] = JSON.parse(line[2]);
        const final = frames.at(-1).mark;
        const titleOffset = (frame) => frame.title.y - frame.mark.y;
        const drift = Math.max(...frames.map((frame) => Math.abs(titleOffset(frame) - titleOffset(frames[0]))));
        if (drift > 2) throw new Error(`the title moved ${drift} pixels inside the mark`);
        for (const [before, after] of frames.slice(0, -1).map((frame, index) => [frame.mark, frames[index + 1].mark])) {
            const lastStep = Math.abs(final.height - after.height) < 1 && Math.abs(final.width - after.width) < 1;
            if (lastStep && Math.abs(after.height - before.height) > 12) throw new Error(`the mark jumped to its height: ${before.height} to ${after.height}`);
            if (lastStep && Math.abs(after.width - before.width) > 40) throw new Error(`the mark jumped to its width: ${before.width} to ${after.width}`);
        }
    }
} finally {
    await browser.close();
}
