import {shallowRef} from "vue";
import {transport} from "../api/transport.js";

const catalogues = new Map();

export class Buttons {
    constructor(environment, prompts) {
        this.environment = environment;
        this.prompts = prompts;
        this.offers = shallowRef({buttons: [], missing: {}});
        this.loading = shallowRef(false);
        this.loaded = shallowRef(false);
        this.failed = shallowRef("");
        this.pending = null;
    }

    load() {
        if (this.pending) return this.pending;
        this.loading.value = true;
        this.pending = this.read().then((offers) => {
            this.offers.value = offers;
            this.loaded.value = true;
            this.failed.value = "";
            return offers;
        }).catch((error) => {
            this.failed.value = error.message;
            throw error;
        }).finally(() => { this.pending = null; this.loading.value = false; });
        return this.pending;
    }

    async read() {
        const response = await transport.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
        if (response.status === 403) return {buttons: [], missing: {}};
        const answer = await response.json();
        if (!response.ok) throw new Error(answer.error || "Buttons could not be loaded.");
        return answer;
    }

    heard(event) {
        const key = event.data?.key;
        const suiteChanged = event.event.startsWith("setting.") && (!key || key.includes("suite"));
        return event.event === "registry.sync" || suiteChanged ? this.load() : Promise.resolve();
    }

    async allowed(module) {
        await this.load();
        const missing = this.offers.value.missing[module];
        if (!missing?.length) return true;
        const accepted = await this.prompts.ask(module, {window: `button:${module}`, reads_missing: "",
            runs_missing: missing.map(({label, line}) => `${label}: ${line}`).join(", ")});
        if (!accepted) return false;
        await this.load();
        return !this.offers.value.missing[module]?.length;
    }
}

export function startButtons(environment, prompts) {
    const catalogue = new Buttons(environment, prompts);
    catalogues.set(environment, catalogue);
    catalogue.load().catch(() => {});
    return catalogue;
}

export const buttonCatalogue = (environment) => catalogues.get(environment);

export function buttonsAt(environment, slot, row) {
    const catalogue = buttonCatalogue(environment);
    if (!catalogue) return [];
    return catalogue.offers.value.buttons.filter((button) => button.slots.includes(slot))
        .filter((button) => row || !button.runs.includes("{row_id}"))
        .filter((button) => !button.condition || !row || !Object.hasOwn(row, button.condition.field) || button.condition.values.includes(row[button.condition.field]))
        .map((button) => ({...button, menu: button.menu.filter((item) => row || !item.runs.includes("{row_id}"))}))
        .sort((first, second) => Number(Boolean(first.from)) - Number(Boolean(second.from)));
}

export async function allowed(module, environment) {
    if (!module) return true;
    const catalogue = buttonCatalogue(environment);
    if (!catalogue) throw new Error("Button permissions are not ready.");
    return catalogue.allowed(module);
}
