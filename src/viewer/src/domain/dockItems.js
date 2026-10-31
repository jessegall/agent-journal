// Version 4's dock behaviour on the docking module's rows: an item leaves once its leaves_at passes unless it is kept or pointed at

export const MOST_DOCKED_RUNS = 6;
export const GROUP_FROM = 3;

// a run is an item whose type leaves by itself after its row ends; any other is a row docked for as long as the person keeps it
export const isRunItem = (item, declarationOf) => (declarationOf(item.type)?.leaves_after_seconds || 0) > 0;

// whether an item closes by itself: it has a leave time and the person has not kept it
export const isLeaving = (item) => Boolean(item.leaves_at && !item.kept);

// whether an item is docked at a moment, in seconds: docked, and either not leaving, not yet due, or held under the pointer
export const isDocked = (item, now, held = new Set()) =>
    item.state === "docked" && (!isLeaving(item) || now < item.leaves_at || held.has(item.id));

export const dockedItems = (items, now, held = new Set()) => items.filter((item) => isDocked(item, now, held)).sort((a, b) => a.id - b.id);

// the runs past the most the dock holds: those leaving and due go first, oldest first; a run still going always stays
export function keptRuns(runs, now, most = MOST_DOCKED_RUNS) {
    const over = runs.length - most;
    if (over <= 0) return runs;
    const cleared = new Set(runs.filter((run) => run.leaves_at && !run.kept && !(run.leaves_at > now)).slice(0, over).map((run) => run.id));
    return runs.filter((run) => !cleared.has(run.id));
}

// whether runs share one compact row: from three at once, and on until one run is left
export const groupedRuns = (count, wasGrouped) => (count >= GROUP_FROM ? true : count <= 1 ? false : wasGrouped);
