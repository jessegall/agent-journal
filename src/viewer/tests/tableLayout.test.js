import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import TableLayout from "../kit/TableLayout.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => {
    document.body.innerHTML = "";
    location.hash = "";
});

const COLUMNS = [{key: "id", label: "Number"}, {key: "line", label: "Command"}, {key: "state", label: "State"}];
const ROWS = [
    {id: 12, line: "pytest tests -q", state: "Passed", ref: "output:12"},
    {id: 13, line: "npm run build", state: "Failed", ref: "output:13", tone: "danger"},
    {id: 14, line: "journal task list", state: "Passed"},
];
const FIELDS = [{key: "state", label: "State", options: [["Passed", "Passed"], ["Failed", "Failed"]], get: (row) => row.state}];

function table() {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(TableLayout, {columns: COLUMNS, rows: ROWS, fields: FIELDS})}).mount(element);
    return element;
}

test("test_columns_from_data: the header and each row's cells follow the declared columns, one line a cell", () => {
    const element = table();
    expect([...element.querySelectorAll(".table-row.head .cell")].map((cell) => cell.textContent)).toEqual(["Number", "Command", "State"]);
    const first = [...element.querySelectorAll(".table-row:not(.head)")][0];
    expect([...first.querySelectorAll(".cell")].map((cell) => cell.textContent)).toEqual(["12", "pytest tests -q", "Passed"]);
    expect(element.querySelectorAll(".table-row:not(.head)").length).toBe(3);
});

test("test_row_opens_inspector: a row that names a ref opens that row's inspector, and a row without one stays a plain line", async () => {
    const element = table();
    const rows = [...element.querySelectorAll(".table-row:not(.head)")];
    expect(rows[2].tagName).toBe("DIV");
    rows[1].click();
    await settle();
    expect(location.hash).toContain("open=output:13");
});

test("the filter bar narrows the rows by a chosen state", async () => {
    const element = table();
    element.querySelector('[data-filter-chip="state"] .filter-chip-main').click();
    await settle();
    document.body.querySelector('[data-filter-option="Failed"]').click();
    await settle();
    expect(element.querySelectorAll(".table-row:not(.head)").length).toBe(1);
});
