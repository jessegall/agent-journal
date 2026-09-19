const CAP = 60;
const NOISE = new Set([
    "cd",
    "echo",
    "sleep",
    "true",
    "false",
    "set",
    "export",
    "clear",
    "printf",
    "done",
    "fi",
    "for",
    "while",
    "until",
    "if",
    "elif",
    "case",
    "esac",
    "read",
    "shift",
    "wait",
    "exit",
]);
const LEAD = new Set(["do", "then", "else"]);
const RUNNERS = new Set(["node", "python", "python3", "perl", "ruby", "php", "bash", "sh", "zsh", "osascript"]);
const FILTERS = new Set(["tail", "head", "grep", "wc", "sort", "cut", "sed", "awk", "tr", "xargs", "cat", "tee", "uniq"]);
const SUBVERBS = new Set([
    "git",
    "npm",
    "npx",
    "pnpm",
    "yarn",
    "docker",
    "cargo",
    "go",
    "make",
    "brew",
    "pip",
    "pip3",
    "journal",
    "gh",
    "kubectl",
]);
const WRAPPERS = new Set(["perl", "timeout", "time", "exec", "nohup"]);

function split(line, atBreak) {
    const out = [];
    let cur = "";
    let quote = "";
    let depth = 0;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (quote) {
            cur += c;
            if (c === quote) quote = "";
            continue;
        }
        if (c === '"' || c === "'") {
            quote = c;
            cur += c;
            continue;
        }
        if (c === "$" && line[i + 1] === "(") depth += 1;
        else if (c === ")" && depth) depth -= 1;
        if (depth) {
            cur += c;
            continue;
        }
        const width = atBreak(line, i);
        if (width) {
            if (cur.trim()) out.push(cur.trim());
            cur = "";
            i += width - 1;
            continue;
        }
        cur += c;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

function pieces(line) {
    return split(line, (s, i) => (["&&", "||"].includes(s.slice(i, i + 2)) ? 2 : ";|\n".includes(s[i]) ? 1 : 0));
}

function words(piece) {
    return split(piece, (s, i) => (/\s/.test(s[i]) ? 1 : 0));
}

function verbOf(piece) {
    let w = words(piece.replace(/^[({\s;&]+|[)}\s;&]+$/g, ""));
    while (w.length > 1 && (/^[A-Z_][A-Z0-9_]*=/.test(w[0]) || WRAPPERS.has(w[0]) || LEAD.has(w[0]))) {
        w =
            w[0] === "perl"
                ? w.slice(
                      Math.max(
                          1,
                          w.findIndex((x, i) => i > 0 && !x.startsWith("-") && !/^'.*'$/.test(x))
                      )
                  )
                : w.slice(1);
    }
    return w;
}

function pieceGist(piece, translate) {
    const w = verbOf(piece);
    if (!w.length || NOISE.has(w[0])) return "";
    const verb = w[0].split("/").pop();
    if (translate && /^journal(\.py)?$/.test(verb)) return translate(w.slice(1).filter((x) => !x.startsWith("-")));
    if (w.some((x) => x.startsWith("<<"))) return `${verb} script`;
    const rest = SUBVERBS.has(verb) && w[1] && !w[1].startsWith("-") ? `${verb} ${w[1]}` : verb;
    const given = w.slice(rest.split(" ").length);
    const args = given.filter((x, i) => !/^(-|["'$]|\d*[<>]|&|\/dev\/)/.test(x) && !(/^\d+$/.test(x) && /^-/.test(given[i - 1] || "")));
    const scripted = RUNNERS.has(verb) && given.some((x) => /^["']/.test(x));
    const shown = args.length ? `${rest} ${args[0].split("/").pop()}` : scripted ? `${rest} script` : rest;
    return shown.length > CAP ? `${shown.slice(0, CAP - 1).trimEnd()}…` : shown;
}

function withoutScripts(command) {
    const lines = String(command || "").split("\n");
    const kept = [];
    let end = "";
    let patch = false;
    for (const line of lines) {
        if (line.trim() === "*** Begin Patch") {
            patch = true;
            continue;
        }
        if (patch) {
            if (line.trim() === "*** End Patch") patch = false;
            continue;
        }
        if (end) {
            if (line.trim() === end) end = "";
            continue;
        }
        kept.push(line);
        const m = line.match(/<<-?\s*['"]?(\w+)/);
        if (m) end = m[1];
    }
    return kept.join("\n");
}

function expanded(pieces_) {
    const names = {};
    const out = [];
    for (const piece of pieces_) {
        const m = piece.trim().match(/^([A-Za-z_]\w*)=([^\s=]\S*)$/);
        if (m) {
            names[m[1]] = m[2];
            continue;
        }
        out.push(piece.replace(/\$\{?([A-Za-z_]\w*)\}?/g, (all, name) => (name in names ? names[name] : all)));
    }
    return out;
}

export function gists(command, translate) {
    return expanded(pieces(withoutScripts(command)))
        .filter((p, i) => !(i > 0 && FILTERS.has(verbOf(p)[0] || "")))
        .map((p) => pieceGist(p, translate))
        .filter(Boolean);
}

export function gist(command, translate) {
    const real = gists(command, translate);
    if (!real.length) return "";
    const kept = [real[real.length - 1]];
    for (let i = real.length - 2; i >= 0; i--) {
        if (CAP - kept.join(" · ").length - 3 < 12) break;
        kept.unshift(real[i]);
    }
    return kept.join(" · ");
}

export function gistTokens(text) {
    const tokens = String(text || "")
        .split(/\s+/)
        .filter(Boolean);
    const command = SUBVERBS.has(tokens[0]) ? 2 : 1;
    return tokens.map((value, i) => ({value, kind: i < command ? "command" : "argument"}));
}
