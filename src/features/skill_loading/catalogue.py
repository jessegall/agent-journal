from dataclasses import dataclass, replace
from functools import cache
import re
import time
from pathlib import Path

import features
from controllers.types import Agents
from engine.record import Record
from providers import PROVIDERS
from resources.base import SYSTEM, names

SKILL = names("name", "description", "path", "changed", "loaded", "stale", "always", "size", "keywords")
from skills import LIBRARY, skill_name
from engine.package import data

READ: dict[str, tuple] = {}
LISTED: dict[str, tuple] = {}


@dataclass(frozen=True)
class Catalogued:
    at: float
    marks: tuple
    skills: list
    file_marks: tuple
    files: list

    def fresh(self, marks: tuple) -> bool:
        return self.marks == marks and time.monotonic() - self.at < FRESH_FOR

    def unchanged(self, marks: tuple) -> bool:
        return self.marks == marks and self.file_marks == tuple(map(marked, self.files))


CATALOGUED: dict[str, Catalogued] = {}
FRESH_FOR = 60.0
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
                                       SKILL.changed: found.st_mtime, SKILL.size: found.st_size,
                                       SKILL.keywords: [w.strip() for w in head.get("keywords", "").strip('"[]').split(",") if w.strip()]})
    return held[1]


def catalogue(root: Path) -> list[dict]:
    marks = tuple(marked(root / home) for home in HOMES)
    held = CATALOGUED.get(str(root))
    if held and held.fresh(marks):
        return held.skills
    if held and held.unchanged(marks):
        CATALOGUED[str(root)] = replace(held, at=time.monotonic())
        return held.skills
    files = [f for home in HOMES for f in skill_files(root / home)]
    out = {}
    for f in files:
        try:
            out.setdefault(f.parent.name, described(f, root))
        except FileNotFoundError:
            continue
    CATALOGUED[str(root)] = Catalogued(time.monotonic(), marks, list(out.values()), tuple(map(marked, files)), files)
    return CATALOGUED[str(root)].skills


def marked(home: Path) -> int:
    try:
        return home.stat().st_mtime_ns
    except OSError:
        return 0


def skill_files(home: Path) -> list[Path]:
    mark = marked(home)
    if not mark:
        return []
    held = LISTED.get(str(home))
    if not held or held[0] != mark:
        held = LISTED[str(home)] = (mark, [folder / "SKILL.md" for folder in sorted(p for p in home.iterdir() if p.is_dir()) if (folder / "SKILL.md").is_file()])
    return held[1]


@cache
def subjects() -> set[str]:
    folder = data("skills")
    return {"journal", *(skill_name(path.stem) for path in folder.glob("*.md") if path.name != "journal.md")}


@cache
def marked_primary() -> frozenset[str]:
    return frozenset(skill_name(path.stem) for path in data("skills").glob("*.md") if frontmatter(path.read_text(errors="replace")).get("primary") == "true")


def primary() -> set[str]:
    return {"journal", *marked_primary(), *(skill_name(name) for name, f in features.FEATURES.items() if f.details and f.details.primary)}


def defaults() -> set[str]:
    return primary()


def managed() -> set[str]:
    return subjects() | {skill_name(name) for name in features.names()}


def available(root: Path) -> set[str]:
    return {f.parent.name for f in skill_files(root / LIBRARY)}


def loaded_at(agent) -> dict[str, float]:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return {}
    return provider().loaded_skills(Path(agent.transcript))


def recent_before_compaction(agent, share: float) -> set[str]:
    provider = PROVIDERS.get(agent.provider)
    if not provider or not agent.transcript:
        return set()
    prior = provider().prior_window(Path(agent.transcript))
    return {name for name, used in prior.prior_loads.items() if used >= prior.prior_used * (1 - share)}


def chosen(record: Record) -> list[str]:
    named = record.setting(Record.skills)
    current = managed() & available(record.root.parent)
    return sorted(current & (defaults() if named is None else set(named) | primary()))


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


def keywords(record: Record) -> dict[str, list[str]]:
    chosen_words = record.setting("skill_loading", {}).get("keywords") or {}
    out = {s[SKILL.name]: list(s[SKILL.keywords]) for s in catalogue(record.root.parent)}
    for name, words in chosen_words.items():
        out[name] = [w.strip() for w in (words if isinstance(words, list) else str(words).split(",")) if w.strip()]
    return {name: words for name, words in out.items() if words}


def set_keywords(record: Record, name: str, words: list[str]) -> list[str]:
    settings = record.setting("skill_loading", {})
    record.set_setting("skill_loading", {**settings, "keywords": {**(settings.get("keywords") or {}), name: words}})
    return keywords(record).get(name, [])


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
