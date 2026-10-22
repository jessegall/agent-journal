// @vitest-environment node
import {expect, test, vi} from "vitest";

const installPlugin = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {installPlugin: (...a) => installPlugin(...a)}}));

const {usePluginInstall} = await import("../src/composables/pluginInstall.js");

test("an install names the aliases it skipped because their names are taken", async () => {
    installPlugin.mockResolvedValue({name: "judging", manifest: {title: "Judging"}, skipped_aliases: ["task", "test"]});
    const install = usePluginInstall();
    install.previewed.value = {name: "judging"};
    await install.install("/plugins/judging");
    expect(install.outcome.value).toEqual({ok: true, text: "Judging is installed. Its aliases task, test were not added: those names are taken."});
});

test("an install that skipped nothing says only that it is installed", async () => {
    installPlugin.mockResolvedValue({name: "judging", manifest: {title: "Judging"}, skipped_aliases: []});
    const install = usePluginInstall();
    install.previewed.value = {name: "judging"};
    await install.install("/plugins/judging");
    expect(install.outcome.value.text).toBe("Judging is installed.");
});
