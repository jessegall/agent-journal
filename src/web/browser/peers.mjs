import {journal, runScenarios} from "./harness.mjs";

await runScenarios(process.argv[2], {
    async "a message from another session shows in the open chat as it is filed, with no reload"(page, url) {
        await page.goto(`${url}#/main`);
        await page.getByPlaceholder("Message the agent").waitFor();
        const word = `peer${Date.now()}`;
        journal("message", "create", `${word} says hello`, "--brief", `${word} says hello from another session`, "--set", "peer=other-project", "--set", "from_session=uds:/tmp/x.sock");
        await page.getByText("From agent other-project", {exact: false}).first().waitFor();
        await page.getByText(`${word} says hello from another session`).first().waitFor();
    },
});
