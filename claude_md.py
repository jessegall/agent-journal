from __future__ import annotations

import re
from pathlib import Path

from templates import render

FILE = "CLAUDE.md"
BEGIN = "<!-- journal:rules -->"
END = "<!-- /journal:rules -->"
_ENTRY = re.compile(r"<!-- journal:rule (\d+) -->\n.*?<!-- /journal:rule \1 -->", re.S)

MESSAGES = {
    "heading": "## Rules of this project",
    "lead": "Written here by `journal rules inject <n>`; `journal rules uninject <n>` takes one out, and "
            "`journal disable` removes this whole block. Edits inside these markers are replaced.",
    "entry": "<!-- journal:rule {n} -->\n**{fact}**[\n\n{refs:\n}]\n<!-- /journal:rule {n} -->",
    "ref": "- see `{path}`",
    "no_rule": "there is no rule {n}. `journal rules` numbers them.",
    "struck": "rule {n} is struck; a struck rule is not written into {file}",
    "already": "rule {n} is already in {file}; `journal rules uninject {n}` takes it out",
    "injected": "rule {n} is in {file} now[, with a path reference to {refs:, }]",
    "not_in": "rule {n} is not in {file}",
    "uninjected": "rule {n} is out of {file}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def path(root: Path) -> Path:
    return root.parent / FILE


def _text(root: Path) -> str:
    f = path(root)
    return f.read_text() if f.is_file() else ""


def _entries(text: str) -> dict[int, str]:
    if BEGIN not in text or END not in text:
        return {}
    inside = text.partition(BEGIN)[2].partition(END)[0]
    return {int(m.group(1)): m.group(0) for m in _ENTRY.finditer(inside)}


def injected(root: Path) -> set[int]:
    """The rule numbers CLAUDE.md holds, read from the file itself."""
    return set(_entries(_text(root)))


def _write(root: Path, entries: dict[int, str]) -> None:
    had = _text(root)
    if BEGIN in had and END in had:
        head, _, rest = had.partition(BEGIN)
        tail = rest.partition(END)[2]
    else:
        head, tail = had, ""
    if entries:
        block = "\n\n".join([BEGIN, say("heading"), say("lead"), *[entries[n] for n in sorted(entries)], END])
        want = (head.rstrip() + "\n\n" if head.strip() else "") + block + ("\n" + tail.lstrip("\n") if tail.strip() else "\n")
    else:
        want = head.rstrip() + ("\n\n" + tail.lstrip("\n") if tail.strip() else "\n") if (head.strip() or tail.strip()) else ""
    if want == had:
        return
    if not want and not path(root).is_file():
        return
    path(root).write_text(want)


def _refs(root: Path, rule: dict, body: str) -> list[str]:
    import cleanup
    import docs
    project, out = root.parent, []
    if rule.get("doc"):
        doc, prt, _ = docs.get(root, str(rule["doc"]).split("#")[0])
        if doc is not None:
            out.append(str(((prt or doc)["path"]).relative_to(project)))
    for raw in cleanup.PATH.findall(f"{rule.get('fact', '')}\n{body}"):
        p = raw.split(":")[0].strip("`,.")
        if p and not p.startswith(("http", "www.")) and (project / p).is_file() and p not in out:
            out.append(p)
    return out


def inject(root: Path, n: int) -> tuple[bool, str]:
    import pins
    rules = pins._all(root, pins.RULES)
    if not 1 <= n <= len(rules):
        return False, say("no_rule", n=n)
    rule = rules[n - 1]
    if rule.get("struck"):
        return False, say("struck", n=n, file=FILE)
    entries = _entries(_text(root))
    if n in entries:
        return False, say("already", n=n, file=FILE)
    refs = _refs(root, rule, pins.body(root, n, pins.RULES))
    entries[n] = say("entry", n=n, fact=" ".join(rule["fact"].split()),
                     refs=[say("ref", path=p) for p in refs] or None)
    _write(root, entries)
    return True, say("injected", n=n, file=FILE, refs=refs or None)


def uninject(root: Path, n: int) -> tuple[bool, str]:
    entries = _entries(_text(root))
    if n not in entries:
        return False, say("not_in", n=n, file=FILE)
    del entries[n]
    _write(root, entries)
    return True, say("uninjected", n=n, file=FILE)


def forget(root: Path, n: int) -> None:
    """A struck rule leaves CLAUDE.md with it; quiet when it was never there."""
    if n in injected(root):
        uninject(root, n)


def remove(root: Path) -> bool:
    """Take the whole block out. True when there was one."""
    if BEGIN not in _text(root):
        return False
    _write(root, {})
    return True
