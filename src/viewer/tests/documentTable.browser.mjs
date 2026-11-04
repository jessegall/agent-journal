import assert from "node:assert/strict";
import {chromium} from "playwright-core";

const [address, shots] = process.argv.slice(2);
const browser = await chromium.launch({headless: true, executablePath: process.env.CHROMIUM_PATH});
// the viewer key signs one browser in; both widths share its login
const login = await browser.newContext();

const TEXT_COLUMN_EM = 14;

// a document with one wide table at one width: every text column keeps its readable width, the table scrolls in its own box and nothing else scrolls sideways
async function check(width, height, name) {
    const page = await login.newPage();
    await page.setViewportSize({width, height});
    await page.goto(`${address}#open=docs:1`);
    await page.locator("[data-resource-text] table").waitFor();
    await page.waitForTimeout(400);

    const facts = await page.locator("[data-resource-text] table").evaluate((table) => {
        const cell = table.querySelector("td.text-column");
        const box = table.getBoundingClientRect();
        const text = table.closest("[data-resource-text]");
        return {
            textColumns: table.querySelectorAll("thead th.text-column").length, columns: table.querySelectorAll("thead th").length,
            cellWidth: cell.getBoundingClientRect().width, fontSize: parseFloat(getComputedStyle(cell).fontSize), scrolls: getComputedStyle(table).overflowX,
            tableScrolls: table.scrollWidth > table.clientWidth + 1, tableInside: box.right <= text.getBoundingClientRect().right + 1,
            textOverflow: text.scrollWidth - text.clientWidth,
            panelOverflow: [...document.querySelectorAll("[data-resource-panel], [data-resource-panel] .scroll")].map((element) => element.scrollWidth - element.clientWidth),
        };
    });
    assert.ok(facts.textColumns === 3, `the long columns are text columns: ${facts.textColumns} of ${facts.columns}`);
    assert.ok(facts.cellWidth >= TEXT_COLUMN_EM * facts.fontSize - 1, `a text column is ${facts.cellWidth}px wide, less than ${TEXT_COLUMN_EM}em`);
    assert.equal(facts.scrolls, "auto");
    assert.ok(facts.tableScrolls, "the table scrolls sideways in its own box");
    assert.ok(facts.tableInside, "the table stays inside the text");
    assert.ok(facts.textOverflow <= 0, `the text overflows sideways by ${facts.textOverflow}`);
    assert.ok(facts.panelOverflow.every((overflow) => overflow <= 0), `the panel overflows sideways: ${facts.panelOverflow}`);
    const pageOverflow = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        widest: [...document.querySelectorAll("body *")].filter((element) => !element.closest("[data-resource-panel]") && element.getBoundingClientRect().right > innerWidth + 1).filter((element) => element instanceof HTMLElement).slice(0, 14).map((element) => `${element.tagName}.${element.className}[${element.getAttribute("aria-label") ?? ""}]${Math.round(element.getBoundingClientRect().left)}-${Math.round(element.getBoundingClientRect().right)}`),
    }));
    assert.ok(pageOverflow.overflow <= 0, `the page scrolls sideways by ${pageOverflow.overflow}: ${pageOverflow.widest.join(", ")}`);
    await page.screenshot({path: `${shots}-${name}.png`});
    await page.close();
}

try {
    await check(1440, 900, "wide");
    await check(390, 844, "phone");
} finally {
    await browser.close();
}
