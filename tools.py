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
    if field in ("title", "summary") and not " ".join((value or "").split()):
        # every tool keeps a title and a summary: they are what the catalogue hands every session
        return False, say("needs_title" if field == "title" else "needs_summary")
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
def facts_text(t: dict) -> str:
    out = []
    if t.get("usage"):
        out.append(t["usage"])
    out.append(say("fact_entry", entry=t["entry"]) if t.get("entry") else say("fact_no_entry"))
    if _age(t.get("at", "")):
        out.append(_age(t.get("at", "")))
    return " · ".join(out)


def row(n: int, t: dict) -> dict:
    return {"n": n, "name": t["name"], "title": t.get("title", ""), "summary": t.get("summary", ""),
            "usage": t.get("usage", ""), "when": t.get("when", ""), "entry": t.get("entry", ""),
            "source": t.get("source", ""), "track": t.get("track", ""), "age": _age(t.get("at", "")),
            "facts": facts_text(t)}


def detail(root: Path, n: int, t: dict) -> dict:
    script = entry_path(root, t)
    return {**row(n, t), "body": t.get("body", ""), "file": str(t["path"].relative_to(root.parent)),
            "script": str(script.relative_to(root.parent)) if script is not None else ""}


def render_rows(rows: list[dict]) -> str:
    items = [fmt.Item(title=say("head", name=r["name"], title=r["title"]) if r["title"] and r["title"] != r["name"] else r["name"],
                      text=r["summary"], meta=r["facts"]) for r in rows]
    return "\n\n".join(fmt.render(fmt.Out(items=(it,))) for it in items)


def catalogue(root: Path, width: int | None = None, cap: int | None = None, page: int = 1,
              order: str = fmt.DESC) -> str:
    import entries
    tools = _all(root)
    if not tools:
        return say("empty")
    rows, left = entries.listing(list(enumerate(tools, 1)), lambda pair: row(*pair), cap=cap, page=page, order=order)
    return render_rows(rows) + fmt.more("tools", left, page, order)


def show(root: Path, name: str, width: int | None = None) -> tuple[bool, str]:
    t, err = get(root, name)
    if t is None:
        return False, err
    n = next(i for i, x in enumerate(_all(root), 1) if x["name"] == t["name"])
    return True, show_text(detail(root, n, t), width)


def show_text(d: dict, width: int | None = None) -> str:
    width = fmt.room(width)
    env = say("show_env", env=d["track"]) if d["track"] else ""
    out = [fmt.title(say("show_title", name=d["name"]), sub=d["title"]),
           "  " + fmt.dim(" · ".join(x for x in (d["source"], env, d["age"]) if x))]
    out.append(fmt.section(say("what")))
    out.append(fmt.wrap(d["summary"], width=width))
    if d["usage"]:
        out.append(fmt.section(say("usage")))
        out.append("  " + d["usage"])
    if d["when"]:
        out.append(fmt.section(say("when")))
        out.append(fmt.wrap(d["when"], width=width))
    if d["body"].strip():
        out.append("")
        out.append(d["body"].rstrip())
    out.append(fmt.section(say("run")))
    rows = [(say("run_it", name=d["name"]), say("run_it_what"))]
    if d["script"]:
        rows.append((d["script"], say("script")))
    else:
        rows.append((say("set_entry", name=d["name"]), say("set_entry_what")))
    out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(d["file"]))
    return "\n".join(out)


def carry(root: Path, cap: int = 20) -> str:
    tools = _all(root)
    if not tools:
        return ""
    rows = [say("carry_row", name=t["name"].ljust(22), summary=t.get("summary", ""), pad=" " * 24, usage=t.get("usage"))
            for t in tools[:cap]]
    return say("carry", n=len(tools), rows=rows, more=fmt.cut(cap, len(tools), "journal tools"))
