import {rememberInTab, rememberedInTab} from "../platform/storage.js";

// how long a remembered time is kept, in seconds: a day, far past the longest cooldown
const KEPT_SECONDS = 24 * 60 * 60;

// The figure's remembered times, cooldown key to wall-clock seconds (pile.js draw), kept in the page's session storage under `key` so a
// reload reads them back and every act still waits out its cooldown; a time older than KEPT_SECONDS at `now` is let go, and a storage that
// refuses only loses them (platform/storage.js)
export class KeptTimes extends Map {
    constructor(key, now) {
        super();
        this.key = key;
        const times = rememberedInTab(key, {});
        for (const [name, at] of Object.entries(times && typeof times === "object" ? times : {})) {
            if (Number.isFinite(at) && now - at < KEPT_SECONDS) super.set(name, at);
        }
    }

    set(name, at) {
        super.set(name, at);
        rememberInTab(this.key, Object.fromEntries(this));
        return this;
    }
}
