import re

CAP = 60
NOISE = {"cd", "echo", "sleep", "true", "false", "set", "export", "clear", "printf", "done", "fi", "for", "while",
         "until", "if", "elif", "case", "esac", "read", "shift", "wait", "exit"}
LEAD = {"do", "then", "else"}
VALUED = {"--root", "--env", "--as", "--session", "--agent"}
RUNNERS = {"node", "python", "python3", "perl", "ruby", "php", "bash", "sh", "zsh", "osascript"}
FILTERS = {"tail", "head", "grep", "wc", "sort", "cut", "sed", "awk", "tr", "xargs", "cat", "tee", "uniq"}
SUBVERBS = {"git", "npm", "npx", "pnpm", "yarn", "docker", "cargo", "go", "make", "brew", "pip", "pip3", "journal", "gh", "kubectl"}
WRAPPERS = {"perl", "timeout", "time", "exec", "nohup", "env", "sudo", "nice", "caffeinate", "xvfb-run"}
OPERANDS = {"-u", "-n", "-e", "-C", "-g", "-p", "-s", "-k", "--signal", "--user"}
NAMED = re.compile(r"^[A-Za-z_]\w*=")
JOURNAL_SCRIPT = re.compile(r"(^|/)journal\.py$")
JOURNAL_VERB = re.compile(r"^journal(\.py)?$")
CAPTURE = re.compile(r"^([A-Za-z_]\w*)=\$\((.*)\)$", re.S)
ASSIGN = re.compile(r"^([A-Za-z_]\w*)=([^\s=]\S*)$")
VARIABLE = re.compile(r"\$\{?([A-Za-z_]\w*)\}?")
HEREDOC = re.compile(r"<<-?\s*['\"]?(\w+)")
DROPPED = re.compile(r"^(-|[\"'$]|\d*[<>]|&|/dev/)")
DIGITS = re.compile(r"^\d+$")


def split(line: str, width) -> list[str]:
    out, cur, quote, depth, i = [], "", "", 0, 0
    while i < len(line):
        c = line[i]
        if c == "\\" and quote != "'" and i + 1 < len(line):
            cur += c + line[i + 1]
            i += 2
            continue
        if quote:
            cur += c
            if c == quote:
                quote = ""
            i += 1
            continue
        if c in "\"'":
            quote = c
            cur += c
            i += 1
            continue
        if c == "$" and line[i + 1:i + 2] == "(":
            depth += 1
        elif c == ")" and depth:
            depth -= 1
        if depth:
            cur += c
            i += 1
            continue
        step = width(line, i)
        if step:
            if cur.strip():
                out.append(cur.strip())
            cur = ""
            i += step
            continue
        cur += c
        i += 1
    if cur.strip():
        out.append(cur.strip())
    return out


def pieces(line: str) -> list[str]:
    return split(line, lambda s, i: 2 if s[i:i + 2] in ("&&", "||") else 1 if s[i] in ";|\n" else 0)


def words(piece: str) -> list[str]:
    return split(piece, lambda s, i: 1 if s[i].isspace() else 0)


def unwrapped(w: list[str]) -> list[str]:
    wrapper, i = w[0], 1
    while i < len(w) - 1:
        x = w[i]
        if x in OPERANDS or (wrapper == "perl" and x == "-e"):
            i += 2
        elif (x.startswith("-") or NAMED.match(x) or (wrapper == "timeout" and x[:1].isdigit())
              or (wrapper == "perl" and x.startswith("'") and x.endswith("'"))):
            i += 1
        else:
            break
    return w[i:]


def verb_of(piece: str) -> list[str]:
    w = words(piece.strip("({ ;&)}\t\n"))
    while len(w) > 1 and (NAMED.match(w[0]) or w[0] in WRAPPERS or w[0] in LEAD):
        w = unwrapped(w) if w[0] in WRAPPERS else w[1:]
    return w


def journal_words(w: list[str]) -> list[str]:
    out, i = [], 0
    while i < len(w):
        if w[i] in VALUED:
            i += 1
        elif not w[i].startswith("-"):
            out.append(w[i])
        i += 1
    return out


def piece_gist(piece: str, translate=None) -> str:
    w = verb_of(piece)
    if not w or w[0] in NOISE:
        return ""
    if w[0].split("/")[-1].lower() in RUNNERS and JOURNAL_SCRIPT.search(w[1] if len(w) > 1 else ""):
        w = w[1:]
    verb = w[0].split("/")[-1]
    if translate and JOURNAL_VERB.match(verb):
        return translate(journal_words(w[1:]))
    if any(x.startswith("<<") for x in w):
        return f"{verb} script"
    rest = f"{verb} {w[1]}" if verb in SUBVERBS and len(w) > 1 and not w[1].startswith("-") else verb
    given = w[len(rest.split(" ")):]
    args = [x for i, x in enumerate(given)
            if not DROPPED.match(x) and not (DIGITS.match(x) and (given[i - 1] if i else "").startswith("-"))]
    scripted = verb in RUNNERS and any(x[:1] in "\"'" for x in given)
    first = args[0] if args else ""
    shown = f"{rest} {[p for p in first.split('/') if p][-1] if '/' in first else first}" if args else f"{rest} script" if scripted else rest
    return f"{shown[:CAP - 1].rstrip()}…" if len(shown) > CAP else shown


def without_scripts(command: str) -> str:
    kept, end, patch = [], "", False
    for line in str(command or "").split("\n"):
        if line.strip() == "*** Begin Patch":
            patch = True
            continue
        if patch:
            if line.strip() == "*** End Patch":
                patch = False
            continue
        if end:
            if line.strip() == end:
                end = ""
            continue
        kept.append(line)
        found = HEREDOC.search(line)
        if found:
            end = found.group(1)
    return "\n".join(kept)


def expanded(parts: list[str]) -> list[str]:
    names: dict[str, str] = {}
    out: list[str] = []
    for piece in parts:
        inner = CAPTURE.match(piece.strip())
        if inner:
            out.extend(expanded(pieces(inner.group(2))))
            continue
        named = ASSIGN.match(piece.strip())
        if named:
            names[named.group(1)] = named.group(2)
            continue
        out.append(VARIABLE.sub(lambda m: names.get(m.group(1), m.group(0)), piece))
    return out


def gists(command: str, translate=None) -> list[str]:
    parts = expanded(pieces(without_scripts(command)))
    kept = [p for i, p in enumerate(parts) if not (i > 0 and (verb_of(p) or [""])[0] in FILTERS)]
    return [said for said in (piece_gist(p, translate) for p in kept) if said]


def gist(command: str, translate=None) -> str:
    real = gists(command, translate)
    if not real:
        return ""
    kept = [real[-1]]
    for said in reversed(real[:-1]):
        if CAP - len(" · ".join(kept)) - 3 < 12:
            break
        kept.insert(0, said)
    return " · ".join(kept)


def gist_tokens(text: str) -> list[dict]:
    found = [t for t in str(text or "").split() if t]
    command = 2 if found and found[0] in SUBVERBS else 1
    return [{"value": value, "kind": "command" if i < command else "argument"} for i, value in enumerate(found)]
