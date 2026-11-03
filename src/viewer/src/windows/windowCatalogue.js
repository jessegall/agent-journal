import {checkServer} from "../state/updating.js";
import {transport} from "../api/transport.js";
import {computed, shallowRef} from "vue";
import {withFamilyOptions} from "./chatOptions.js";

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
        this.loaded = shallowRef(false);
        this.person = null;
    }

    async load() {
        const offers = await this.fetchOffers();
        this.person = offers.person_id ?? null;
        const offered = withFamilyOptions(offers.windows, await this.fetchMarks());
        this.windows.value = offered.filter((window) => !["dropdown", "bar", "page"].includes(window.place));
        this.pages.value = offered.filter((window) => window.place === "page");
        this.bars.value = offered.filter((window) => window.place === "bar");
        this.dropdowns.value = offered.filter((window) => window.place === "dropdown");
        this.loaded.value = true;
    }

    heard(event) {
        return event.event === "registry.sync" ? this.load() : Promise.resolve();
    }

    get offered() {
        return [...this.windows.value, ...this.pages.value];
    }

    placed(page) {
        const shows = page === "agent" ? "one-agent" : "environment";
        return this.windows.value.filter((window) => window.shows === shows);
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
        return this.windows.value.find((window) => window.name === name) || this.pages.value.find((window) => window.name === name) || null;
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

// the stream resumes by itself from the last event it had; a break makes the page ask whether the server went away
export function followEvents(environment, heard) {
    const source = transport.stream(`/api/events?environment=${encodeURIComponent(environment)}`);
    source.onmessage = (message) => heard(JSON.parse(message.data));
    source.onerror = checkServer;
    return () => source.close();
}
