from pathlib import Path

from engine.stored import read_json, write_json

KEYED = ("features", "triggers")


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


def in_settings(home: Path, was: str, now: str) -> bool:
    f = home / "settings.json"
    kept = read_json(f, {})
    after = owned({k: moved(v, was, now) if k in KEYED and isinstance(v, dict) else v for k, v in kept.items()}, was, now)
    if after == kept:
        return False
    write_json(f, after, indent=2)
    return True


def in_gates(runtime: Path, was: str, now: str) -> int:
    changed = 0
    for f in sorted(runtime.glob("sessions/*/gate-*.json")):
        holds = read_json(f)
        if holds is None:
            continue
        after = moved(holds, was, now)
        if after != holds:
            write_json(f, after)
            changed += 1
    return changed


def in_triggers(runtime: Path, was: str, now: str) -> int:
    changed = 0
    for f in sorted(runtime.glob(f"sessions/*/trigger-{was}.json")) + sorted(runtime.glob(f"sessions/*/trigger-{was}.*.json")):
        tail = f.name[len(f"trigger-{was}"):-len(".json")]
        target = f.with_name(f"trigger-{now}{tail}.json")
        if not target.exists():
            f.rename(target)
            changed += 1
    return changed


def in_cursors(home: Path, was: str, now: str) -> int:
    f = home / "runtime" / f"cursor-{was}"
    target = home / "runtime" / f"cursor-{now}"
    if not f.is_file() or target.exists():
        return 0
    f.rename(target)
    return 1


def in_skills(home: Path, was: str, now: str) -> bool:
    from skills import skill_name
    f = home / "settings.json"
    kept = read_json(f, {})
    chosen = kept.get("skills")
    if "." in now or not isinstance(chosen, list) or skill_name(was) not in chosen:
        return False
    write_json(f, {**kept, "skills": sorted({skill_name(now) if name == skill_name(was) else name for name in chosen})}, indent=2)
    return True


def rename(root: Path, was: str, now: str) -> dict:
    root = Path(root)
    homes = sorted(p for p in (root / "environments").glob("*") if p.is_dir())
    return {"settings": sum(in_settings(home, was, now) for home in homes),
            "gates": in_gates(root / "runtime", was, now),
            "triggers": in_triggers(root / "runtime", was, now),
            "cursors": sum(in_cursors(home, was, now) for home in homes),
            "skills": sum(in_skills(home, was, now) for home in homes)}
