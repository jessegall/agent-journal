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
import sys
from datetime import datetime, timezone
from pathlib import Path

import fmt

DIR = "tools"
FILE = "tool.md"
STRUCK = "struck"
FIELDS = ("name", "title", "summary", "usage", "when", "entry", "at", "track", "source")
INTERPRETERS = {".py": ["python3"], ".php": ["php"], ".sh": ["sh"], ".js": ["node"], ".ts": ["npx", "tsx"],
                ".rb": ["ruby"], ".pl": ["perl"]}


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


def uncatalogued(root: Path) -> list[Path]:
    d = folder(root)
    if not d.is_dir():
        return []
    return [f for f in sorted(d.iterdir()) if f.is_dir() and f.name != STRUCK and not (f / FILE).is_file()]


def get(root: Path, name: str) -> tuple[dict | None, str]:
    name = (name or "").strip()
    t = next((x for x in _all(root) if x["name"] == name), None)
    if t is None:
        return None, f"there is no tool named {name!r}. `journal tools` lists them."
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
        return False, 'a tool needs a name: journal tools add <name> "<title>" --summary="<one line>"'
    if not title:
        return False, 'a tool needs a title: journal tools add <name> "<title>" --summary="<one line>"'
    if not summary:
        return False, ('a tool needs a summary — the one line every session is handed:\n'
                       '  journal tools add <name> "<title>" --summary="<what it does>" --usage="<how to call it>"')
    if get(root, name)[0] is not None:
        return False, f"a tool named {name!r} exists. `journal tools {name}` reads it."
    if entry:
        cand = [folder(root) / name / entry, root.parent / entry]
        if not any(c.is_file() for c in cand):
            return False, (f"--entry names {entry!r}, which is neither in .journal/tools/{name}/ nor at "
                           f"{entry} under the project. Write the script first, or leave --entry for later.")
    meta = {"name": name, "title": title, "summary": summary, "usage": " ".join((usage or "").split()),
            "when": " ".join((when or "").split()), "entry": entry, "at": _now(), "track": track,
            "source": "the agent"}
    _write(folder(root) / name / FILE, meta, body)
    return True, (f"tool {name}: {title}\n  .journal/tools/{name}/{FILE}"
                  + ("" if entry else f"\n  no entry point yet: put the script in that folder and set `entry:` in tool.md"))


def set_field(root: Path, name: str, field: str, value: str) -> tuple[bool, str]:
    if field not in ("title", "summary", "usage", "when", "entry"):
        return False, f"a tool has title, summary, usage, when and entry; not {field!r}"
    t, err = get(root, name)
    if t is None:
        return False, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta[field] = " ".join((value or "").split())
    _write(t["path"], meta, t["body"])
    return True, f"tool {name}: {field} is now {meta[field]!r}"


def remove(root: Path, name: str, why: str) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, 'say why: journal tools remove <name> "<why it is retired>"'
    t, err = get(root, name)
    if t is None:
        return False, err
    struck = folder(root) / STRUCK
    struck.mkdir(exist_ok=True)
    dst = struck / name
    if dst.exists():
        dst = struck / f"{name}-{_now()[:19].replace(':', '')}"
    meta = {k: t.get(k, "") for k in FIELDS}
    _write(t["path"], meta, t["body"] + f"\n\nstruck {_now()[:19]}: {why}\n")
    t["dir"].rename(dst)
    return True, f"tool {name} retired: {why}\n  kept at {dst.relative_to(root.parent)}"


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
        _write(f / FILE, {"name": f.name, "title": f.name.replace("-", " "), "summary": summary or "(no summary yet — journal tools set <name> summary \"…\")",
                          "usage": "", "when": "", "entry": entry, "at": _now(), "track": track, "source": "adopted"}, "")
        out.append(f"  + tool {f.name}" + (f" — entry {entry}" if entry else " — no single entry point; set one with `journal tools set <name> entry <file>`"))
    return out or ["  = every folder under .journal/tools/ is catalogued"]


# ------------------------------------------------------------------ running
def run(root: Path, name: str, args: list[str]) -> int:
    t, err = get(root, name)
    if t is None:
        print(f"  ! {err}", file=sys.stderr)
        return 1
    script = entry_path(root, t)
    if script is None:
        print(f"  ! tool {name} has no entry point" + (f" ({t.get('entry')!r} not found)" if t.get("entry") else "")
              + f". `journal tools set {name} entry <file>` names one.", file=sys.stderr)
        return 1
    if os.access(script, os.X_OK):
        cmd = [str(script)]
    else:
        interp = INTERPRETERS.get(script.suffix)
        if not interp:
            print(f"  ! {script.name} is not executable and has no known interpreter; chmod +x it", file=sys.stderr)
            return 1
        cmd = interp + [str(script)]
    return subprocess.call(cmd + list(args), cwd=root.parent)


# ------------------------------------------------------------------ rendering
def catalogue(root: Path, width: int = 88) -> str:
    tools = _all(root)
    if not tools:
        return "  No tools are catalogued."
    out = []
    for t in tools:
        head = f"{t['name']}  —  {t.get('title', '')}" if t.get("title") and t["title"] != t["name"] else t["name"]
        block = "  " + fmt.bold(head)
        block += "\n" + fmt.wrap(t.get("summary", ""), indent=5, width=width)
        if t.get("usage"):
            block += "\n     " + fmt.dim(t["usage"])
        meta = [x for x in (("entry " + t["entry"]) if t.get("entry") else "no entry point", _age(t.get("at", ""))) if x]
        block += "\n     " + fmt.dim(" · ".join(meta))
        out.append(block)
    return "\n\n".join(out)


def show(root: Path, name: str, width: int = 88) -> tuple[bool, str]:
    t, err = get(root, name)
    if t is None:
        return False, err
    out = [fmt.title(f"TOOL {t['name']}", sub=t.get("title", "")),
           "  " + fmt.dim(" · ".join(x for x in (t.get("source", ""), f"environment {t.get('track', '')}" if t.get("track") else "",
                                                _age(t.get("at", ""))) if x))]
    out.append(fmt.section("what it does"))
    out.append(fmt.wrap(t.get("summary", ""), width=width))
    if t.get("usage"):
        out.append(fmt.section("usage"))
        out.append("  " + t["usage"])
    if t.get("when"):
        out.append(fmt.section("when"))
        out.append(fmt.wrap(t["when"], width=width))
    if t["body"].strip():
        out.append("")
        out.append(t["body"].rstrip())
    script = entry_path(root, t)
    out.append(fmt.section("run"))
    rows = [(f"journal tools run {t['name']} …", "from the project root, with the right interpreter")]
    if script is not None:
        rows.append((str(script.relative_to(root.parent)), "the script itself"))
    else:
        rows.append((f"journal tools set {t['name']} entry <file>", "no entry point yet"))
    out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(str(t["path"].relative_to(root.parent))))
    return True, "\n".join(out)


def carry(root: Path, cap: int = 20) -> str:
    tools = _all(root)
    if not tools:
        return ""
    lines = []
    for t in tools[:cap]:
        lines.append(f"  {t['name']:<22} {t.get('summary', '')}"
                     + (f"\n{'':24} {t['usage']}" if t.get("usage") else ""))
    more = f"\n  … and {len(tools) - cap} more; `journal tools` lists them." if len(tools) > cap else ""
    return (f"TOOLS OF THIS PROJECT, {len(tools)} — scripts kept for repeated work; use one before "
            "writing it again. `journal tools <name>` reads it, `journal tools run <name> …` runs it:\n"
            + "\n".join(lines) + more)
