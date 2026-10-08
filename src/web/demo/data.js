import builtIn from "virtual:built-in-manifest";
import {DEFAULT_HIDDEN} from "../src/domain/chatVisibility.js";
import {PRESETS, arranged, fresh} from "../src/domain/panes.js";
import {expand} from "./moments.js";
import {scenario} from "./scenarios.js";

const HIDDEN = [...DEFAULT_HIDDEN, "skills", "sequences", "notes"];

const quiet = (shape) =>
    shape.dir ? {...shape, a: quiet(shape.a), b: quiet(shape.b)} : shape.tabs.includes("chat") ? {...shape, hide: HIDDEN} : shape;

export async function loadDemo() {
    const preset = PRESETS.find((p) => p.key === scenario.layout);
    const layout = arranged(fresh(), quiet(preset.shape)).layout;
    const laid = (moment) => ({
        ...moment,
        settings: {...moment.settings, viewer: {...moment.settings.viewer, layout, tour_seen: true, chat_hidden: HIDDEN}},
    });
    const {moments} = expand((await scenario.load()).default);
    return {moments: moments.map(laid), builtIn};
}
