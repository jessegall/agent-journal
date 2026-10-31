import {shallowRef} from "vue";

// the windows the journal lists for this environment, asked again whenever the registry is synced: a window whose entry
// URL changed is mounted again from its new file, a removed one turns into its placeholder, and a new one joins the menu
export class WindowCatalogue {
    constructor(fetchOffers) {
        this.fetchOffers = fetchOffers;
        this.windows = shallowRef([]);
    }

    async load() {
        this.windows.value = await this.fetchOffers();
    }

    heard(event) {
        return event.event === "registry.sync" ? this.load() : Promise.resolve();
    }

    window(name) {
        return this.windows.value.find((window) => window.name === name) || null;
    }
}

export async function fetchWindowCatalogue(environment) {
    const response = await fetch(`/api/windows?environment=${encodeURIComponent(environment)}`);
    return (await response.json()).windows;
}

export function followEvents(environment, heard) {
    const source = new EventSource(`/api/events?environment=${encodeURIComponent(environment)}`);
    source.onmessage = (message) => heard(JSON.parse(message.data));
    return () => source.close();
}
