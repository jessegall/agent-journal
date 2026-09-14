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
    """{skill name: {count, at}} for every Skill tool call in a transcript."""
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
                    row = got.setdefault(name, {"count": 0, "at": rec.get("timestamp", "")})
                    row["count"] += 1
    return got


def rows(project: Path, path: Path | None, every_start: list[str] | None = None) -> list[dict]:
    """Every skill on disk with how often this session loaded it, then loaded ones that have no file here."""
    used = loaded(path)
    wanted = set(every_start or [])
    out = [{"name": s["name"], "description": s["description"], "source": s["source"],
            "loaded": used.get(s["name"], {}).get("count", 0), "readable": True, "always": s["name"] in wanted}
           for s in available(project)]
    known = {r["name"] for r in out}
    out += [{"name": n, "description": "", "source": "built in", "loaded": u["count"], "readable": False, "always": n in wanted}
            for n, u in sorted(used.items()) if n not in known]
    return out


def find(project: Path, name: str) -> dict | None:
    """One skill's text, looked up by name among the skills on disk only."""
    if not _NAME.match(name or ""):
        return None
    for s in available(project):
        if s["name"] == name:
            return {"name": s["name"], "description": s["description"], "source": s["source"],
                    "text": s["path"].read_text(errors="replace")}
    return None


ALWAYS = "always_load_skills"


def always(root: Path) -> list[str]:
    """The skills the user asked every session to load at its start."""
    import state
    got = state.get(root, ALWAYS, [])
    return [str(x) for x in got] if isinstance(got, list) else []


def set_always(root: Path, name: str, on: bool) -> list[str]:
    import state
    with state.locked(root):
        now = [x for x in always(root) if x != name] + ([name] if on else [])
        state.put(root, ALWAYS, now)
    return now
