"""The project's tools: scripts the agent keeps for repeated work, catalogued and runnable.

WHAT THIS IS FOR. An agent doing a long refactor writes a script — move a class with every
reference, list uncovered methods, run the fixer on one directory — and the next session
does not know it exists, so it writes it again, slightly differently. Read in a live
project: three such scripts under tools/, each with a docblock that says exactly how to
call it, and no catalogue anywhere. A tool here is that script with its docblock lifted
into a place every session is handed.

A TOOL IS A FOLDER WITH A tool.md. The frontmatter says what it is called, what it does in
one line, how to call it and when; the body says the rest. `entry` names the script,
either in the folder or anywhere in the project, so an existing script is catalogued
where it is. `journal tools run <name> …` runs it from the project root with the right
interpreter; running the script directly works too.

GLOBAL, LIKE DOCS. A tool is the project's. Nothing is deleted: a removed tool moves
under struck/ with the reason.
"""
from __future__ import annotations

import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import fmt
from templates import render as fill

DIR = "tools"
FILE = "tool.md"
STRUCK = "struck"
FIELDS = ("name", "title", "summary", "usage", "when", "entry", "at", "track", "source")
INTERPRETERS = {".py": ["python3"], ".php": ["php"], ".sh": ["sh"], ".js": ["node"], ".ts": ["npx", "tsx"],
                ".rb": ["ruby"], ".pl": ["perl"]}

MESSAGES = {
    "no_such": "there is no tool named {name}. `journal tools` lists them.",
    "needs_name": 'a tool needs a name: journal tools add <name> "<title>" --summary="<one line>"',
    "needs_title": 'a tool needs a title: journal tools add <name> "<title>" --summary="<one line>"',
    "needs_summary": 'a tool needs a summary — the one line every session is handed:\n'
                     '  journal tools add <name> "<title>" --summary="<what it does>" --usage="<how to call it>"',
    "exists": "a tool named {quoted} exists. `journal tools {name}` reads it.",
    "entry_missing": "--entry names {quoted}, which is neither in .journal/tools/{name}/ nor at {entry} under the "
                     "project. Write the script first, or leave --entry for later.",
    "added": "tool {name}: {title}\n  .journal/tools/{name}/{file}",
    "added_no_entry": "\n  no entry point yet: put the script in that folder and set `entry:` in tool.md",
    "not_a_field": "a tool has title, summary, usage, when and entry; not {field}",
    "field_set": "tool {name}: {field} is now {value}",
    "needs_why": 'say why: journal tools strike <name> "<why it is retired>"',
    "struck_note": "\n\nstruck {at}: {why}\n",
    "removed": "tool {name} retired: {why}\n  kept at {path}",
    "adopted_summary": '(no summary yet — journal tools set <name> summary "…")',
    "adopted": "  + tool {name} — {how}",
    "adopted_entry": "entry {entry}",
    "adopted_no_entry": "no single entry point; set one with `journal tools set <name> entry <file>`",
    "all_adopted": "  = every folder under .journal/tools/ is catalogued",
    "no_entry": "tool {name} has no entry point[ ({entry} not found)]. `journal tools set {name} entry <file>` names one.",
    "not_executable": "{script} is not executable and has no known interpreter; chmod +x it",
    "empty": "  No tools are catalogued.",
    "fact_entry": "entry {entry}",
    "fact_no_entry": "no entry point",
    "head": "{name}  —  {title}",
    "show_title": "TOOL {name}",
    "show_env": "environment {env}",
    "what": "what it does",
    "usage": "usage",
    "when": "when",
    "run": "run",
    "run_it": "journal tools run {name} …",
    "run_it_what": "from the project root, with the right interpreter",
    "script": "the script itself",
    "set_entry": "journal tools set {name} entry <file>",
    "set_entry_what": "no entry point yet",
    "carry_row": "  {name} {summary}[\n{pad} {usage}]",
    "carry": "TOOLS OF THIS PROJECT, {n} — scripts kept for repeated work; use one before writing it again. "
             "`journal tools <name>` reads it, `journal tools run <name> …` runs it:\n{rows:\n}{more}",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


def folder(root: Path) -> Path:
    return root / DIR


def _slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s[:40].rstrip("-")


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


def _parse(path: Path) -> tuple[dict, str]:
    text = path.read_text()
    meta: dict = {}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    return meta, text


def _write(path: Path, meta: dict, body: str) -> None:
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS if meta.get(k, "") != "" or k in ("name", "title")] + ["---", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + (body.strip() + "\n" if body.strip() else ""))


def _all(root: Path) -> list[dict]:
    d = folder(root)
    if not d.is_dir():
        return []
    out = []
    for f in sorted(d.iterdir()):
        if f.is_dir() and f.name != STRUCK and (f / FILE).is_file():
            meta, body = _parse(f / FILE)
            out.append({**meta, "name": meta.get("name") or f.name, "body": body, "dir": f, "path": f / FILE})
    return out


def all_tools(root: Path) -> list[dict]:
    """The whole catalogue — the public entry point `_all` is read through."""
    return _all(root)


def uncatalogued(root: Path) -> list[Path]:
    d = folder(root)
    if not d.is_dir():
        return []
    return [f for f in sorted(d.iterdir()) if f.is_dir() and f.name != STRUCK and not (f / FILE).is_file()]


def get(root: Path, name: str) -> tuple[dict | None, str]:
    name = (name or "").strip()
    t = next((x for x in _all(root) if x["name"] == name), None)
    if t is None:
        return None, say("no_such", name=repr(name))
    return t, ""


def entry_path(root: Path, t: dict) -> Path | None:
    """The script to run: a path inside the tool's folder, or relative to the project."""
    e = t.get("entry") or ""
    if not e:
        return None
    cand = [t["dir"] / e, root.parent / e]
    return next((c for c in cand if c.is_file()), None)


# ------------------------------------------------------------------ writing
def add(root: Path, name: str, title: str, summary: str, usage: str, when: str, entry: str, body: str,
        track: str) -> tuple[bool, str]:
    name = _slug(name)
    title = " ".join((title or "").split())
    summary = " ".join((summary or "").split())
    if not name:
        return False, say("needs_name")
    if not title:
        return False, say("needs_title")
    if not summary:
        return False, say("needs_summary")
    if get(root, name)[0] is not None:
        return False, say("exists", quoted=repr(name), name=name)
    if entry:
        cand = [folder(root) / name / entry, root.parent / entry]
        if not any(c.is_file() for c in cand):
            return False, say("entry_missing", quoted=repr(entry), name=name, entry=entry)
    meta = {"name": name, "title": title, "summary": summary, "usage": " ".join((usage or "").split()),
            "when": " ".join((when or "").split()), "entry": entry, "at": _now(), "track": track,
            "source": "the agent"}
    _write(folder(root) / name / FILE, meta, body)
    return True, say("added", name=name, title=title, file=FILE) + ("" if entry else say("added_no_entry"))


def set_field(root: Path, name: str, field: str, value: str) -> tuple[bool, str]:
    if field not in ("title", "summary", "usage", "when", "entry"):
        return False, say("not_a_field", field=repr(field))
    t, err = get(root, name)
    if t is None:
        return False, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta[field] = " ".join((value or "").split())
    _write(t["path"], meta, t["body"])
    return True, say("field_set", name=name, field=field, value=repr(meta[field]))


def remove(root: Path, name: str, why: str) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("needs_why")
    t, err = get(root, name)
    if t is None:
        return False, err
    struck = folder(root) / STRUCK
    struck.mkdir(exist_ok=True)
    dst = struck / name
    if dst.exists():
        dst = struck / f"{name}-{_now()[:19].replace(':', '')}"
    meta = {k: t.get(k, "") for k in FIELDS}
    _write(t["path"], meta, t["body"] + say("struck_note", at=_now()[:19], why=why))
    t["dir"].rename(dst)
    return True, say("removed", name=name, why=why, path=dst.relative_to(root.parent))


def adopt(root: Path, track: str) -> list[str]:
    """A tool.md for every folder under tools/ that has none, from what the folder holds."""
    out = []
    for f in uncatalogued(root):
        files = sorted(x for x in f.iterdir() if x.is_file() and not x.name.startswith("."))
        entry = files[0].name if len(files) == 1 else ""
        summary = ""
        if entry:
            for line in files[0].read_text(errors="replace").splitlines()[:15]:
                s = line.strip().lstrip("#/*! ").strip()
                if s and not s.startswith("<?") and not s.startswith("!") and len(s) > 12 and not s.startswith("use "):
                    summary = s[:200]
                    break
        _write(f / FILE, {"name": f.name, "title": f.name.replace("-", " "), "summary": summary or say("adopted_summary"),
                          "usage": "", "when": "", "entry": entry, "at": _now(), "track": track, "source": "adopted"}, "")
        how = say("adopted_entry", entry=entry) if entry else say("adopted_no_entry")
        out.append(say("adopted", name=f.name, how=how))
    return out or [say("all_adopted")]


# ------------------------------------------------------------------ running
def run(root: Path, name: str, args: list[str]) -> int:
    t, err = get(root, name)
    if t is None:
        fmt.notice(err)
        return 1
    script = entry_path(root, t)
    if script is None:
        fmt.notice(say("no_entry", name=name, entry=repr(t["entry"]) if t.get("entry") else None))
        return 1
    if os.access(script, os.X_OK):
        cmd = [str(script)]
    else:
        interp = INTERPRETERS.get(script.suffix)
        if not interp:
            fmt.notice(say("not_executable", script=script.name))
            return 1
        cmd = interp + [str(script)]
    return subprocess.call(cmd + list(args), cwd=root.parent)


# ------------------------------------------------------------------ rendering
def catalogue(root: Path, width: int | None = None, cap: int | None = None, page: int = 1,
              order: str = fmt.DESC) -> str:
    """The catalogue, capped like `carry` (below) so a bare `journal tools` never grows
    without bound; unlike carry — handed automatically, every session — this is asked
    for, so it pages rather than just saying "N more".

    THE LOOP IS `entries.listing`, shared with `todo.render` and `docs.catalogue` — only
    `facts` below is a tool's own, the same strategy `pins._store` already supplies for a
    pin, a rule and a reminder. A tool has no number, so its row is a name beside its
    summary — `fmt.Item(title=…)` — rather than the numbered shape the other two use; and
    each is rendered on its own rather than as one group, because `fmt`'s COLUMN rows sit
    tight as a table and a tool's own multi-line block never was one.
    """
    width = fmt.room(width)
    import entries
    tools = _all(root)
    if not tools:
        return say("empty")

    def facts(t: dict) -> list[str]:
        out = []
        if t.get("usage"):
            out.append(t["usage"])
        out.append(say("fact_entry", entry=t["entry"]) if t.get("entry") else say("fact_no_entry"))
        if _age(t.get("at", "")):
            out.append(_age(t.get("at", "")))
        return out

    def item_of(t: dict):
        head = say("head", name=t["name"], title=t["title"]) if t.get("title") and t["title"] != t["name"] else t["name"]
        return fmt.Item(title=head, text=t.get("summary", ""), meta=" · ".join(facts(t)))

    rows, left = entries.listing(tools, item_of, cap=cap, page=page, order=order)
    body = "\n\n".join(fmt.render(fmt.Out(items=(it,))) for it in rows)
    body += fmt.more("tools", left, page, order)
    return body


def show(root: Path, name: str, width: int | None = None) -> tuple[bool, str]:
    width = fmt.room(width)
    t, err = get(root, name)
    if t is None:
        return False, err
    env = say("show_env", env=t["track"]) if t.get("track") else ""
    out = [fmt.title(say("show_title", name=t["name"]), sub=t.get("title", "")),
           "  " + fmt.dim(" · ".join(x for x in (t.get("source", ""), env, _age(t.get("at", ""))) if x))]
    out.append(fmt.section(say("what")))
    out.append(fmt.wrap(t.get("summary", ""), width=width))
    if t.get("usage"):
        out.append(fmt.section(say("usage")))
        out.append("  " + t["usage"])
    if t.get("when"):
        out.append(fmt.section(say("when")))
        out.append(fmt.wrap(t["when"], width=width))
    if t["body"].strip():
        out.append("")
        out.append(t["body"].rstrip())
    script = entry_path(root, t)
    out.append(fmt.section(say("run")))
    rows = [(say("run_it", name=t["name"]), say("run_it_what"))]
    if script is not None:
        rows.append((str(script.relative_to(root.parent)), say("script")))
    else:
        rows.append((say("set_entry", name=t["name"]), say("set_entry_what")))
    out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(str(t["path"].relative_to(root.parent))))
    return True, "\n".join(out)


def carry(root: Path, cap: int = 20) -> str:
    tools = _all(root)
    if not tools:
        return ""
    rows = [say("carry_row", name=t["name"].ljust(22), summary=t.get("summary", ""), pad=" " * 24, usage=t.get("usage"))
            for t in tools[:cap]]
    return say("carry", n=len(tools), rows=rows, more=fmt.cut(cap, len(tools), "journal tools"))
