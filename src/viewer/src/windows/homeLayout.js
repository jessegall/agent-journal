import {paneLayout} from "./paneLayout.js";

const HOME = "home";

// the shape a suite stores, in the words the layout code arranges
export function arrangedShape(stored) {
    if (stored.windows) return {tabs: [...stored.windows], active: stored.active};
    return {dir: stored.direction, r: stored.share, a: arrangedShape(stored.first), b: arrangedShape(stored.second)};
}

// the main driver in suite current's answer, "main: coding.builder, worker: coding.worker"
export function mainDriver(drivers) {
    const main = drivers.split(", ").find((driver) => driver.startsWith("main: "));
    return main ? main.slice("main: ".length) : "";
}

// the home page's layout for the environment's suite and main driver, read through the shell's own window line and
// loaded again whenever a setting changes, so switching the suite or the driver brings that layout
export function useHomeLayout(environment, shellLine, catalogue) {
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
        const run = await shellLine(["suite", "current", environment]);
        if (!run.ok) return;
        await store.load({environment, person: catalogue.person, suite: run.value.suite, page: HOME, driver: mainDriver(run.value.drivers)});
    }

    function heard(event) {
        if (event.event.startsWith("setting.") || event.event.startsWith("viewer_layout.")) load();
    }

    return {layout: store.layout, refusal: store.refusal, load, heard, keep: store.replace};
}
