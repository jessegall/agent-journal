import hashlib
import json
from pathlib import Path

from engine.stored import read_json, write_json
from typing import TypedDict

KEYED = ("features", "triggers")
SKILLS = "skills"
SWEPT = "renamed.json"


def under(key: str, was: str, now: str) -> str:
    head, dot, rest = key.partition(".")
    return f"{now}{dot}{rest}" if head == was else key


def moved(mapping: dict, was: str, now: str) -> dict:
    return {under(key, was, now): value for key, value in mapping.items()}


def owned(kept: dict, was: str, now: str) -> dict:
    if was not in kept or not isinstance(kept[was], dict):
        return kept
    name, _, key = now.partition(".")
    mine = {f"{key}.{k}" if key else k: v for k, v in kept.pop(was).items()}
    return {**kept, name: {**kept.get(name, {}), **mine}}


def settled(kept: dict, was: str, now: str) -> dict:
    return owned({k: moved(v, was, now) if k in KEYED and isinstance(v, dict) else v for k, v in kept.items()}, was, now)


def skills_renamed(chosen: list, was: str, now: str) -> list:
    from providers.skill_homes import skill_name
    if "." in now or skill_name(was) not in chosen:
        return chosen
    return sorted({skill_name(now) if name == skill_name(was) else name for name in chosen})


def in_settings(home: Path, aliases: dict) -> bool:
    f = home / "settings.json"
    kept = read_json(f, dict, {})
    after = kept
    for was, now in aliases.items():
        after = settled(after, was, now)
        if isinstance(after.get(SKILLS), list):
            after = {**after, SKILLS: skills_renamed(after[SKILLS], was, now)}
    if after == kept:
        return False
    write_json(f, after, indent=2)
    return True


def in_gates(runtime: Path, aliases: dict) -> int:
    changed = 0
    for f in sorted(runtime.glob("sessions/*/gate-*.json")):
        holds = read_json(f, dict, None)
        if holds is None:
            continue
        after = holds
        for was, now in aliases.items():
            after = moved(after, was, now)
        if after != holds:
            write_json(f, after)
            changed += 1
    return changed


def trigger_renamed(name: str, aliases: dict) -> str:
    for was, now in aliases.items():
        stem = name[len("trigger-"):-len(".json")]
        if stem == was or stem.startswith(f"{was}."):
            name = f"trigger-{now}{stem[len(was):]}.json"
    return name


def in_triggers(runtime: Path, aliases: dict) -> int:
    changed = 0
    for f in sorted(runtime.glob("sessions/*/trigger-*.json")):
        target = f.with_name(trigger_renamed(f.name, aliases))
        if target != f and not target.exists():
            f.rename(target)
            changed += 1
    return changed


def in_cursors(home: Path, aliases: dict) -> int:
    changed = 0
    for was, now in aliases.items():
        f, target = home / "runtime" / f"cursor-{was}", home / "runtime" / f"cursor-{now}"
        if f.is_file() and not target.exists():
            f.rename(target)
            changed += 1
    return changed


class Renamed(TypedDict):
    settings: int
    gates: int
    triggers: int
    cursors: int


def rename(root: Path, aliases: dict) -> Renamed:
    root = Path(root)
    homes = sorted(p for p in (root / "environments").glob("*") if p.is_dir())
    return {"settings": sum(in_settings(home, aliases) for home in homes),
            "gates": in_gates(root / "runtime", aliases),
            "triggers": in_triggers(root / "runtime", aliases),
            "cursors": sum(in_cursors(home, aliases) for home in homes)}


def swept_file(root: Path) -> Path:
    return Path(root) / "runtime" / SWEPT


def named(aliases: dict) -> str:
    return hashlib.sha256(json.dumps(aliases, sort_keys=True).encode()).hexdigest()[:16]


def sweep(root: Path, aliases: dict) -> Renamed | None:
    """Renames what a feature's old name left behind, once for each set of aliases: the sweep walks every environment's settings and every session's triggers, so it runs when the names change and not on every command."""
    done = read_json(swept_file(root), dict, {})
    if done.get("aliases") == named(aliases):
        return None
    renamed = rename(root, aliases)
    write_json(swept_file(root), {"aliases": named(aliases)})
    return renamed
