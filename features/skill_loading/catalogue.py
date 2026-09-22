import re
from pathlib import Path

import features
from controllers.types import Agents
from engine.record import Record
from providers import PROVIDERS
from resources.base import SYSTEM, names

SKILL = names("name", "description", "path", "changed", "loaded", "stale", "always", "size")
from skills import LIBRARY, skill_name
from engine.package import data

READ: dict[str, tuple] = {}
HOMES = (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))


def frontmatter(text: str) -> dict:
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    return dict(re.findall(r"^(\w+):\s*(.*)$", m.group(1), re.M)) if m else {}


def described(f: Path, root: Path) -> dict:
    found = f.stat()
    stamp = (found.st_mtime_ns, found.st_size)
    held = READ.get(str(f))
    if not held or held[0] != stamp:
        head = frontmatter(f.read_text(errors="replace"))
        held = READ[str(f)] = (stamp, {SKILL.name: f.parent.name, SKILL.description: head.get("description", "").strip('"'), SKILL.path: str(f.relative_to(root)),
                                       SKILL.changed: found.st_mtime, SKILL.size: found.st_size})
    return held[1]


def catalogue(root: Path) -> list[dict]:
    out = {}
    for home in HOMES:
        for f in sorted((root / home).glob("*/SKILL.md")):
            out.setdefault(f.parent.name, described(f, root))
    return list(out.values())


def subjects() -> set[str]:
    folder = data("skills")
    return {"journal", *(skill_name(path.stem) for path in folder.glob("*.md") if path.name != "journal.md")}


def defaults() -> set[str]:
    return {"journal"}


def managed() -> set[str]:
    return subjects() | {skill_name(name) for name in features.names()}


def available(root: Path) -> set[str]:
    return {f.parent.name for f in (root / LIBRARY).glob("*/SKILL.md")}


def loaded_at(agent) -> dict[str, float]:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return {}
    return provider().loaded_skills(Path(agent.transcript))


def chosen(record: Record) -> list[str]:
    named = record.setting(Record.skills)
    current = managed() & available(record.root.parent)
    return sorted(current & (defaults() if named is None else set(named)))


def skills(record: Record, n: int = 0) -> list[dict]:
    always = set(chosen(record))
    agents = Agents(record, actor=SYSTEM)
    agent = agents.load(n) if n else agents.primary()
    when = loaded_at(agent) if agent else {}
    out = []
    for s in catalogue(record.root.parent):
        at = when.get(s[SKILL.name], 0)
        out.append({**s, SKILL.loaded: at, SKILL.stale: bool(at) and s[SKILL.changed] > at, SKILL.always: s[SKILL.name] in always})
    return out


def always(record: Record, name: str, on: bool) -> list[str]:
    from features import FEATURES
    record.skills = sorted(set(chosen(record)) - {name} | ({name} if on else set()))
    if "session_briefing" in FEATURES:
        from features.session_briefing.block import rebuild
        rebuild(record)
    return record.skills


def handed(record: Record) -> str:
    named = chosen(record)
    return f"SKILLS to load now, at every start, before the first write: {', '.join(f'Skill: {s}' for s in named)}" if named else ""
