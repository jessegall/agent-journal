import re
from pathlib import Path

import features
from controllers.types import Agents
from engine.record import Record
from providers import PROVIDERS
from resources.base import SYSTEM, names

SKILL = names("name", "description", "path", "changed", "loaded", "stale", "always", "size")
from skills import LIBRARY, skill_name

HOMES = (LIBRARY, *(cls.skill_home for cls in PROVIDERS.values() if cls.skill_home))


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


def managed() -> set[str]:
    subjects = Path(__file__).resolve().parents[2] / "skills"
    return {"journal", *(skill_name(name) for name in features.names()), *(skill_name(path.stem) for path in subjects.glob("*.md") if path.name != "journal.md")}


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
    return sorted(current if named is None else current & set(named))


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
