import {arranged, fresh, wellShaped} from "../domain/panes.js";

// a page's layouts, one for each suite, page and driver: the person's saved layout with its version when its shape is
// well made, else the suite's layout for the page under that driver, else for the plain page; a layout is loaded as it
// was saved, a tab whose window is gone included, and saved only when the person changes it, against the version it
// was loaded at
export class LayoutStore {
    constructor({saved, defaults, save}) {
        this.saved = saved;
        this.defaults = defaults;
        this.save = save;
    }

    async layout(key) {
        const stored = await this.saved(key);
        if (stored !== null && wellShaped(stored.layout)) return stored;
        const shape = await this.defaults(key);
        return {layout: shape === null ? fresh() : arranged(fresh(), shape).layout, version: null};
    }

    keep(key, layout, version) {
        return this.save(key, layout, version);
    }
}
