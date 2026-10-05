const INCLUDED = /^sequence:(\d+)(?: steps (\d+)(?:-(\d+))?)?$/;

export function stepsOf(sequence, all, seen = []) {
    const known = new Map(all.map((one) => [one.n, one]));
    return (sequence.sections || []).flatMap((section) => {
        const match = INCLUDED.exec((section.body || "").trim());
        const included = match && known.get(Number(match[1]));
        if (!included || [...seen, sequence.n].includes(included.n)) return [{...section, from: null}];
        const inner = stepsOf(included, all, [...seen, sequence.n]);
        const first = Number(match[2] || 1);
        const last = Number(match[3] || match[2] || inner.length);
        return inner.slice(first - 1, last).map((step) => ({...step, from: step.from || {n: included.n, title: included.title}}));
    });
}
