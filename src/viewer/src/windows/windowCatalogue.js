import {computed, shallowRef} from "vue";

// the windows the journal lists for this environment and the person they are listed for, asked again whenever the registry is synced: a window whose entry
// URL changed is mounted again from its new file, a removed one turns into its placeholder, and a new one joins the menu
export class WindowCatalogue {
    constructor(fetchOffers) {
        this.fetchOffers = fetchOffers;
        this.windows = shallowRef([]);
        this.person = null;
    }

    async load() {
        const offers = await this.fetchOffers();
        this.person = offers.person_id ?? null;
        this.windows.value = offers.windows;
    }

    heard(event) {
        return event.event === "registry.sync" ? this.load() : Promise.resolve();
    }

    get offered() {
        return this.windows.value;
    }

    placed(page) {
        const place = page === "agent" ? "agent" : "environment";
        return this.windows.value.filter((window) => window.place === place);
    }

    // the windows an agent of this role is offered: agent windows whose roles name it or name none
    forAgent(role) {
        const view = Object.create(this);
        view.windows = computed(() => this.windows.value.filter((window) => window.place === "agent" && (!window.roles?.length || window.roles.includes(role))));
        return view;
    }

    group(windows = this.windows.value) {
        const modules = [...new Set(windows.map((window) => window.module))];
        return modules.map((module) => ({module, windows: windows.filter((window) => window.module === module)}));
    }

    window(name) {
        return this.windows.value.find((window) => window.name === name) || null;
    }
}

export async function fetchWindowCatalogue(environment) {
    const response = await fetch(`/api/windows?environment=${encodeURIComponent(environment)}`);
    return await response.json();
}

export function followEvents(environment, heard) {
    const source = new EventSource(`/api/events?environment=${encodeURIComponent(environment)}`);
    source.onmessage = (message) => heard(JSON.parse(message.data));
    return () => source.close();
}
