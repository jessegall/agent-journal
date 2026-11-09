import {transport} from "../api/transport.js";
import {browserEvents} from "./browserEvents.js";
import {computed, shallowRef, toValue, watch} from "vue";
import {withFamilyOptions} from "./chatOptions.js";
import {browserCopy} from "./paneLayout.js";

const KEPT_WINDOWS_KEY = "journal.kept-windows";

// the windows the journal lists for this environment and the person they are listed for, asked again whenever the registry is synced: a window whose entry
// URL changed is mounted again from its new file, a removed one turns into its placeholder, and a new one joins the menu
export class WindowCatalogue {
    constructor(fetchOffers, fetchMarks = async () => []) {
        this.fetchOffers = fetchOffers;
        this.fetchMarks = fetchMarks;
        this.windows = shallowRef([]);
        this.dropdowns = shallowRef([]);
        this.bars = shallowRef([]);
        this.pages = shallowRef([]);
        this.sections = shallowRef([]);
        this.inspectors = shallowRef({});
        this.loaded = shallowRef(false);
        this.person = null;
        this.keptWindows = browserCopy.read(KEPT_WINDOWS_KEY) ?? {};
    }

    async load() {
        const offers = await this.fetchOffers();
        this.person = offers.person_id ?? null;
        const offered = withFamilyOptions(offers.windows, await this.fetchMarks());
        this.windows.value = offered.filter((window) => !["bar", "page", "section"].includes(window.place));
        this.pages.value = offered.filter((window) => ["page", "pane_or_page"].includes(window.place));
        this.sections.value = offered.filter((window) => window.place === "section");
        this.bars.value = offered.filter((window) => window.place === "bar");
        this.dropdowns.value = offered.filter((window) => window.place === "dropdown");
        this.inspectors.value = Object.fromEntries((offers.inspectors ?? []).map((inspector) => [inspector.term, inspector]));
        this.loaded.value = true;
        this.keptWindows = Object.fromEntries(offered.map((window) => [window.name, {skeleton: window.skeleton ?? [], icon: window.icon}]));
        browserCopy.write(KEPT_WINDOWS_KEY, this.keptWindows);
    }

    // the skeleton and the icon a window declares, kept in this browser so the first paint can draw them before the catalogue answers
    skeleton(name) {
        return this.keptWindows[name]?.skeleton ?? [];
    }

    keptIcon(name) {
        return this.keptWindows[name]?.icon ?? "";
    }

    heard(event) {
        return event.event === "registry.sync" || event.event.startsWith("setting.") ? this.load() : Promise.resolve();
    }

    get offered() {
        return [...this.windows.value, ...this.pages.value];
    }

    placed(page) {
        const shows = page === "agent" ? "one-agent" : "environment";
        return this.windows.value.filter((window) => window.place === "dropdown" || window.shows === shows);
    }

    // the windows an agent of this role is offered: every window of the environment's work, and the one-agent windows whose roles name it or name none
    forAgent(role) {
        const view = Object.create(this);
        view.windows = computed(() => this.windows.value.filter((window) => window.shows !== "one-agent" || !window.roles?.length || window.roles.includes(role)));
        return view;
    }

    group(windows = this.windows.value) {
        const modules = [...new Set(windows.map((window) => window.module))];
        return modules.map((module) => {
            const own = windows.filter((window) => window.module === module);
            return {module, title: own[0].module_title || own.map((window) => window.title).join(", "), windows: own};
        });
    }

    window(name) {
        return [...this.windows.value, ...this.pages.value, ...this.sections.value].find((window) => window.name === name) || null;
    }

    sectionsAt(slot) {
        return this.sections.value.filter((section) => section.slots.includes(slot));
    }

    // the listed inspector of a term, or null while the registry lists none
    inspector(term) {
        return this.inspectors.value[noun] ?? null;
    }

    dropdown(name) {
        return this.dropdowns.value.find((window) => window.name === name) || null;
    }

    bar(name) {
        return this.bars.value.find((window) => window.name === name) || null;
    }
}

export async function fetchWindowCatalogue(environment) {
    const response = await transport.raw(`/api/windows?environment=${encodeURIComponent(environment)}`);
    return await response.json();
}

// a page's events, through the stream the tabs of the browser share
export function followEvents(environment, heard, patterns = ["*.*"]) {
    const follower = {environment, heard, patterns: []};
    const events = browserEvents();
    let unfollow = null;
    const stop = watch(() => [...new Set(toValue(patterns))].sort().join("\n"), (next) => {
        follower.patterns = next.split("\n");
        if (unfollow) events.tellWanted();
        else unfollow = events.follow(follower);
    }, {immediate: true});
    return () => {
        stop();
        unfollow();
    };
}
