import re
import time
from pathlib import Path

from controllers.types import Agents, Messages
from engine.record import Record
from providers import PROVIDERS
from resources.base import SYSTEM, USER, names
from resources.types import AgentRow

SKILL = names("name", "description", "path", "changed", "loaded", "stale", "always", "size")
HOMES = (".claude/skills", ".codex/skills")


def frontmatter(text: str) -> dict:
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    return dict(re.findall(r"^(\w+):\s*(.*)$", m.group(1), re.M)) if m else {}


def catalogue(root: Path) -> list[dict]:
    out = {}
    for home in HOMES:
        for f in sorted((root / home).glob("*/SKILL.md")):
            head = frontmatter(f.read_text(errors="replace"))
            out.setdefault(f.parent.name, {SKILL.name: f.parent.name, SKILL.description: head.get("description", "").strip('"'), SKILL.path: str(f.relative_to(root)),
                                           SKILL.changed: f.stat().st_mtime, SKILL.size: f.stat().st_size})
    return list(out.values())


def loaded_at(agent) -> dict[str, float]:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return {}
    when = {}
    for use in provider().tools(Path(agent.transcript)):
        name = str((use.get("input") or {}).get("skill") or "")
        if use.get("name") == "Skill" and name:
            when[name] = float(use.get("at") or 0)
    return when


def skills(record: Record, n: int = 0) -> list[dict]:
    always = set(record.skills)
    agents = Agents(record, actor=SYSTEM)
    rows = [a for a in agents.all() if a.status and a.status != "stopped"]
    agent = agents.load(n) if n else (rows[-1] if rows else None)
    when = loaded_at(agent) if agent else {}
    out = []
    for s in catalogue(record.root.parent):
        at = when.get(s[SKILL.name], 0)
        out.append({**s, SKILL.loaded: at, SKILL.stale: bool(at) and s[SKILL.changed] > at, SKILL.always: s[SKILL.name] in always})
    return out


def load_now(record: Record, name: str) -> str:
    Messages(record, actor=USER).create(f"Please load the {name} skill now", brief=f"Skill: {name} — load it before the next write.")
    return "the agent is asked; it reads the message at once if idle, else at its next stop"


def always(record: Record, name: str, on: bool) -> list[str]:
    record.skills = sorted(set(record.skills) - {name} | ({name} if on else set()))
    return record.skills


def handed(record: Record) -> str:
    return f"SKILLS to load now, at every start: {', '.join(f'Skill: {s}' for s in record.skills)}" if record.skills else ""
