const INCLUDED = /^sequence:(\d+)(?: steps (\d+)(?:-(\d+))?)?$/;

function range(match, count) {
    const first = Number(match[2] || 1);
    const last = Number(match[3] || match[2] || count);
    return [first - 1, last];
}

export function stepsOf(sequence, all, seen = []) {
    const known = new Map(all.map((one) => [one.n, one]));
    const trail = [...seen, sequence.n];
    return (sequence.sections || []).flatMap((section) => {
        const match = INCLUDED.exec((section.body || "").trim());
        const included = match && known.get(Number(match[1]));
        // An include that would loop back stays a plain step, as the server hands it out.
        if (!included || trail.includes(included.n)) return [{...section, from: null}];
        const inner = stepsOf(included, all, trail);
        return inner.slice(...range(match, inner.length)).map((step) => ({...step, from: step.from || {n: included.n, title: included.title}}));
    });
}
