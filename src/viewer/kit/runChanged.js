export async function runChanged(change, line, run) {
    if (!change) return run(line);
    const {target, fields} = change;
    const before = Object.fromEntries(Object.keys(fields).map((key) => [key, target[key]]));
    const undo = () => Object.assign(target, before);
    Object.assign(target, fields);
    let accepted = false;
    try {
        const answer = await run(line);
        accepted = answer.ok;
        return answer;
    } finally {
        if (!accepted) undo();
    }
}
