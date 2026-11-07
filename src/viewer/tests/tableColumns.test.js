import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";
import {render} from "../src/text/index.js";

const TABLE = "| Area | Rule |\n|---|---|\n| Tax | The cart counts every price in whole cents and rounds once at the end |\n| Fee | Flat |";

test("a column with long cells is a text column in its head and every row, and a short column is not", () => {
    const html = render(TABLE);
    expect(html).toContain('<th>Area</th><th class="text-column">Rule</th>');
    expect(html.match(/<td class="text-column">/g)).toHaveLength(2);
    expect(html.match(/<td>/g)).toHaveLength(2);
});

test("a text column keeps 14em and the table scrolls sideways in its own box", () => {
    const styles = readFileSync(resolve(__dirname, "../src/text/table.css"), "utf8");
    expect(styles).toMatch(/\.md td\.text-column \{\s*min-width: 14em;/);
    expect(styles).toMatch(/\.md table \{[^}]*overflow-x: auto;/);
    const document = readFileSync(resolve(__dirname, "../src/resource/document/DocumentText.vue"), "utf8");
    expect(document).toMatch(/:deep\(table\) \{[^}]*max-width: 100%;[^}]*overflow-x: auto;/);
});
