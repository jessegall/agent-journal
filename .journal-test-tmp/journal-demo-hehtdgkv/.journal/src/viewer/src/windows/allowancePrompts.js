import {shallowRef} from "vue";

const TYPES = ["reads", "runs"];
const words = (text) => (text ? text.split(", ") : []);

// the prompts a third-party window shows the person: its missing read lines first, then its missing commands, each
// allowed only when the person agrees, through the shell's own window line
export class AllowancePrompts {
    constructor(runShellLine) {
        this.runShellLine = runShellLine;
        this.current = shallowRef(null);
    }

    async ask(title, access) {
        for (const type of TYPES) {
            const lines = words(access[`${type}_missing`]);
            if (!lines.length) continue;
            if (!(await this.prompt({window: access.window, title, type, lines}))) return false;
            await this.runShellLine(`window allow ${access.window} --type ${type}`);
        }
        return true;
    }

    prompt(request) {
        return new Promise((resolve) => {
            this.current.value = {...request, resolve};
        });
    }

    answer(allowed) {
        const request = this.current.value;
        this.current.value = null;
        request.resolve(allowed);
    }
}

export function promptText({title, type, lines}) {
    return `${title} wants to ${type === "reads" ? "read" : "run"}: ${lines.join(", ")}. Allow?`;
}

export function windowPermissions(access, ask) {
    return {
        reads: words(access.reads_allowed),
        runs: words(access.runs_allowed),
        missing: [...words(access.reads_missing), ...words(access.runs_missing)],
        ask,
    };
}
