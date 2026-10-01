import {PRESETS, arranged, fresh} from "../src/domain/panes.js";
import {expand} from "./moments.js";
import {scenario} from "./scenarios.js";

const OPENING = "jesse";

export async function loadDemo() {
    const preset = PRESETS.find((p) => p.key === OPENING);
    const layout = arranged(fresh(), preset.shape).layout;
    const laid = (moment) => ({...moment, settings: {...moment.settings, viewer: {...moment.settings.viewer, layout, tour_seen: true}}});
    const {moments, branches} = expand((await scenario.load()).default);
    return {
        moments: moments.map(laid),
        branches: Object.fromEntries(Object.entries(branches).map(([label, grown]) => [label, grown.map(laid)])),
    };
}
