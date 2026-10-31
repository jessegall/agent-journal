import {leaves, wellShaped} from "../domain/panes.js";
import {mainDriver} from "./homeLayout.js";
import {optionsFromHidden} from "../domain/markFamilies.js";

const SHELL_WINDOW = "viewer.shell";
const MOVED = "layouts_moved";

// the windows version 4's views became
export const WINDOW_OF = {
    chat: "messages.chat",
    feed: "coding.file-feed",
    terminal: "coding.terminal",
    agents: "agents.agents",
    tasks: "tasks.tasks",
    plans: "plans.plans",
};

// version 4's settings and the page and driver each one's layout belongs to now
const OLD = [
    {setting: "layout", page: "home", driver: "main"},
    {setting: "inspector_layout", page: "agent", driver: "main"},
    {setting: "worker_layout", page: "agent", driver: "worker"},
    {setting: "worker_home_layout", page: "home", driver: "worker"},
];

const workerDriver = (drivers) => drivers.split(", ").find((driver) => driver.startsWith("worker: "))?.slice("worker: ".length) ?? "";

// a version 4 layout with every tab, float and away window named by its window; views no window replaces are dropped,
// and a layout that is not well shaped once they are gone is null
// a pane holding the chat keeps the list of marks it hid as the chat window's family switches, unless it already has switches
const withFamilySwitches = (pane, declarations) =>
    pane.hide && declarations.length && !pane.options ? {...pane, options: optionsFromHidden(pane.hide, declarations)} : pane;

export function renamedLayout(layout, declarations = []) {
    if (!layout?.tree || !layout.panes) return null;
    const panes = Object.fromEntries(
        Object.entries(layout.panes).map(([id, pane]) => {
            const tabs = (pane.tabs || []).map((view) => WINDOW_OF[view]).filter(Boolean);
            const active = WINDOW_OF[pane.active] && tabs.includes(WINDOW_OF[pane.active]) ? WINDOW_OF[pane.active] : tabs[0] ?? null;
            return [id, withFamilySwitches({...pane, tabs, active}, tabs.includes(WINDOW_OF.chat) ? declarations : [])];
        }),
    );
    const named = (list) => (list || []).filter((one) => WINDOW_OF[one.view]).map((one) => ({...one, view: WINDOW_OF[one.view]}));
    const next = {...layout, panes, floats: named(layout.floats), away: named(layout.away)};
    return wellShaped(next) && leaves(next.tree).every((id) => panes[id]) ? next : null;
}

// reads the version 4 layout settings once, turns their view names into window names and saves each under the suite,
// page and driver it belongs to, skipping one that is not valid or whose page and driver already have a saved layout,
// then notes that it has moved them
export async function moveLegacyLayouts(shellLine, environment) {
    const moved = await shellLine(["window", "setting", SHELL_WINDOW, MOVED]);
    if (moved.ok && JSON.parse(moved.value.value)) return;
    const run = await shellLine(["suite", "current", environment]);
    if (!run.ok) return;
    const drivers = {main: mainDriver(run.value.drivers), worker: workerDriver(run.value.drivers)};
    const marks = await fetch("/api/marks").then((response) => response.json()).catch(() => []);
    for (const {setting, page, driver} of OLD) {
        const old = await shellLine(["window", "setting", SHELL_WINDOW, setting]);
        if (!old.ok || !old.value.value || !drivers[driver]) continue;
        let layout = null;
        try {
            layout = renamedLayout(JSON.parse(JSON.parse(old.value.value)), marks);
        } catch (error) {
            layout = null;
        }
        if (!layout) continue;
        const key = ["--suite", run.value.suite, "--page", page, "--driver", drivers[driver]];
        const existing = await shellLine(["viewer-layout", "current", ...key]);
        if (existing.ok && existing.value?.layout) continue;
        await shellLine(["viewer-layout", "save", ...key, "--layout", JSON.stringify(layout)]);
    }
    await shellLine(["window", "save-setting", SHELL_WINDOW, MOVED, "true"]);
}
