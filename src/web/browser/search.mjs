import {journal, numberOf, runScenarios, shot} from "./harness.mjs";

const search = (page, url, word) => page.goto(`${url}#/main/search?q=${encodeURIComponent(word)}`);
const archivedSwitch = (page) => page.getByRole("switch", {name: "Include archived items"});

await runScenarios(process.argv[2], {
    async "an archived message is found only with the archived switch on, says it is archived and can be brought back"(page, url) {
        const word = `tidied${Date.now()}`;
        const n = numberOf(journal("message", "create", word, "--brief", `${word} put away`));
        journal("message", "archive", String(n), "cleaning up");
        await search(page, url, word);
        await page.getByText(`Nothing matches “${word}”.`).waitFor();
        await archivedSwitch(page).click();
        await page.getByText("Archived", {exact: true}).waitFor();
        await shot(page, "search-archived");
        await page.getByRole("button", {name: "Bring back"}).click();
        await page.getByText("Brought back").waitFor();
        await page.reload();
        await page.getByText(word).first().waitFor();
        if ((await page.getByText("Archived", {exact: true}).count()) !== 0) throw new Error("a brought back message still says archived");
    },
});
