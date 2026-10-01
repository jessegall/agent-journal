import {PRESETS, arranged, fresh} from "../src/domain/panes.js";
import manifest from "./manifest.json";
import rows from "./rows.json";
import settings from "./settings.json";

const OPENING = "jesse";

export async function loadDemo() {
    const preset = PRESETS.find((p) => p.key === OPENING);
    const layout = arranged(fresh(), preset.shape).layout;
    return {manifest, rows, settings: {...settings, viewer: {...settings.viewer, layout}}};
}
