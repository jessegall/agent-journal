"""Skills an agent can load, and which a session loaded: read from disk and from its transcript, never written."""
from __future__ import annotations

import json
import re
from pathlib import Path

_NAME = re.compile(r"^[A-Za-z0-9_.:-]+$")


def _front(text: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    out = {}
    for line in (m.group(1).splitlines() if m else []):
        key, _, value = line.partition(":")
        out[key.strip()] = value.strip().strip('"')
    return out


def available(project: Path) -> list[dict]:
    """The project's skills, then the user's own; a name the project has is not listed twice."""
    out, names = [], set()
    for source, base in (("project", project / ".claude" / "skills"), ("user", Path.home() / ".claude" / "skills")):
        for f in sorted(base.glob("*/SKILL.md")) if base.is_dir() else []:
            front = _front(f.read_text(errors="replace"))
            name = front.get("name") or f.parent.name
            if name in names:
                continue
            names.add(name)
            out.append({"name": name, "description": front.get("description", ""), "source": source, "path": f})
    return out


def loaded(path: Path | None) -> dict[str, dict]:
    """{skill name: {count, at}} for every Skill tool call in a transcript; `at` is the LAST load."""
    got: dict[str, dict] = {}
    if path is None or not path.is_file():
        return got
    for line in path.open(errors="replace"):
        if '"Skill"' not in line:
            continue
        try:
            rec = json.loads(line)
        except ValueError:
            continue
        for block in (rec.get("message") or {}).get("content") or []:
            if isinstance(block, dict) and block.get("type") == "tool_use" and block.get("name") == "Skill":
                name = str((block.get("input") or {}).get("skill") or "")
                if name:
                    row = got.setdefault(name, {"count": 0, "at": ""})
                    row["count"] += 1
                    row["at"] = rec.get("timestamp", "") or row["at"]
    return got


def _epoch(stamp: str) -> float:
    from datetime import datetime
    try:
        return datetime.fromisoformat(str(stamp).replace("Z", "+00:00")).timestamp()
    except ValueError:
        return 0.0


def _changed_at(folder: Path) -> float:
    """When the skill last changed: the newest file in its folder, references included."""
    newest = 0.0
    for f in folder.rglob("*"):
        if f.is_file() and "__pycache__" not in f.parts and not f.name.startswith("."):
            newest = max(newest, f.stat().st_mtime)
    return newest


def rows(project: Path, path: Path | None, every_start: list[str] | None = None) -> list[dict]:
    """Every skill on disk with how often this session loaded it, then loaded ones that have no file here."""
    used = loaded(path)
    wanted = set(every_start or [])
    out = []
    for s in available(project):
        u = used.get(s["name"], {})
        loaded_at = _epoch(u.get("at", "")) if u else 0.0
        # STALE: the session loaded it, and a file of it changed since — what it holds is not what is on disk
        out.append({"name": s["name"], "description": s["description"], "source": s["source"],
                    "loaded": u.get("count", 0), "readable": True, "always": s["name"] in wanted,
                    "stale": bool(u) and _changed_at(s["path"].parent) > loaded_at})
    known = {r["name"] for r in out}
    out += [{"name": n, "description": "", "source": "built in", "loaded": u["count"], "readable": False, "always": n in wanted,
             "stale": False}
            for n, u in sorted(used.items()) if n not in known]
    return out


def find(project: Path, name: str) -> dict | None:
    """One skill's text, looked up by name among the skills on disk only."""
    if not _NAME.match(name or ""):
        return None
    for s in available(project):
        if s["name"] == name:
            return {"name": s["name"], "description": s["description"], "source": s["source"],
                    "text": s["path"].read_text(errors="replace"), "references": _references(s["path"].parent)}
    return None


#: a reference bigger than this is named, not shown: the panel is for reading, not for scrolling forever
REFERENCE_MAX = 60_000


def _references(folder: Path) -> list[dict]:
    """The files beside SKILL.md, by relative path; markdown and plain text come with their contents."""
    out = []
    for f in sorted(folder.rglob("*")):
        if not f.is_file() or f.name == "SKILL.md" or f.name.startswith(".") or "__pycache__" in f.parts:
            continue
        rel = str(f.relative_to(folder))
        text = None
        if f.suffix.lower() in (".md", ".txt") and f.stat().st_size <= REFERENCE_MAX:
            text = f.read_text(errors="replace")
        out.append({"path": rel, "text": text, "size": f.stat().st_size})
    return out


ALWAYS = "always_load_skills"
#: what every project loads at every start until its user says otherwise: the core skill and the three
#: a session reaches for most. Measured (11 real runs): the others trigger on their own cue.
DEFAULT_ALWAYS = ("journal", "journal-memory", "journal-todos", "journal-messages")


def always(root: Path) -> list[str]:
    """The skills every session loads at its start: the project's own list, or the default until it has one."""
    import state
    got = state.get(root, ALWAYS, None)
    if got is None:
        return list(DEFAULT_ALWAYS)
    return [str(x) for x in got] if isinstance(got, list) else []


def set_always(root: Path, name: str, on: bool) -> list[str]:
    import state
    with state.locked(root):
        now = [x for x in always(root) if x != name] + ([name] if on else [])
        state.put(root, ALWAYS, now)
    return now
