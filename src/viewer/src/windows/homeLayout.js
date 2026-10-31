import {moveLegacyLayouts} from "./legacyLayouts.js";
import {paneLayout} from "./paneLayout.js";

const HOME = "home";

// the shape a suite stores, in the words the layout code arranges
export function arrangedShape(stored) {
    if (stored.windows) return {tabs: [...stored.windows], active: stored.active};
    return {dir: stored.direction, r: stored.share, a: arrangedShape(stored.first), b: arrangedShape(stored.second)};
}

// the driver of a role in suite current's answer, "main: coding.builder, worker: coding.worker"
export function driverOf(drivers, role) {
    const found = drivers.split(", ").find((driver) => driver.startsWith(`${role}: `));
    return found ? found.slice(`${role}: `.length) : "";
}

export const mainDriver = (drivers) => driverOf(drivers, "main");

// a page's layout (the home page's by default) for the environment's suite and a driver, the main one by default, read through the shell's own window line and
// loaded again whenever a setting changes, so switching the suite or the driver brings that layout
export function useHomeLayout(environment, shellLine, catalogue, {page = HOME, driver = null} = {}) {
    const store = paneLayout({
        saved: async ({suite, page, driver}) => {
            const answer = await shellLine(["viewer-layout", "current", "--suite", suite, "--page", page, "--driver", driver]);
            return answer.ok ? {layout: JSON.parse(answer.value.layout), version: answer.value.version} : null;
        },
        defaults: async ({page, driver}) => {
            const answer = await shellLine(["suite", "layout", environment, page, "--driver", driver]);
            return answer.ok ? arrangedShape(answer.value.shape) : null;
        },
        save: async (at, kept, version) => {
            const base = version === null ? [] : ["--base-version", String(version)];
            const answer = await shellLine(["viewer-layout", "save", "--suite", at.suite, "--page", at.page, "--driver", at.driver, "--layout", JSON.stringify(kept), ...base]);
            return answer.ok ? {ok: true, version: answer.value.version} : {ok: false, error: answer.error};
        },
        entry: (name) => catalogue.window(name),
    });

    async function load() {
        await moveLegacyLayouts(shellLine, environment);
        const run = await shellLine(["suite", "current", environment]);
        if (!run.ok) return;
        await store.load({environment, person: catalogue.person, suite: run.value.suite, page, driver: driver ?? mainDriver(run.value.drivers)});
    }

    function heard(event) {
        if (event.event.startsWith("setting.") || event.event.startsWith("viewer_layout.")) load();
    }

    return {store, load, heard};
}
