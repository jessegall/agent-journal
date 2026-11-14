import {holding, leaves, measure, placed} from "../domain/panes.js";
import {mainDriver} from "./homeLayout.js";

// puts a window on the home page's layout from another page: it joins the pane that already holds it, or else the largest pane, and the layout is saved
// the way the home page saves its own. line sends a journal line the way the shell does and answers {ok, value} or {ok: false, error}.
export async function placeOnHome(line, environment, name) {
    const run = await line(["suite", "current", environment]);
    if (!run.ok) return run;
    const at = ["--suite", run.value.suite, "--page", "home", "--driver", mainDriver(run.value.drivers)];
    const current = await line(["viewer-layout", "current", ...at]);
    if (!current.ok) return current;
    const layout = JSON.parse(current.value.layout);
    if (holding(layout, name) !== null) return {ok: true, value: "already"};
    const {rects} = measure(layout.tree);
    const area = (id) => rects[id].w * rects[id].h;
    const largest = leaves(layout.tree).reduce((best, id) => (area(id) > area(best) ? id : best));
    const next = placed(layout, name, largest, "center").layout;
    return line(["viewer-layout", "save", ...at, "--layout", JSON.stringify(next), "--base-version", String(current.value.version)]);
}
