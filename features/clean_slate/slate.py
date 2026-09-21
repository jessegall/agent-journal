import json
import shutil
from pathlib import Path

from engine.record import Record
from engine.stored import read_json
from providers import PROVIDERS
from providers.base import journal_hook

KEY = "clean_slate"


def place(record: Record) -> Path:
    return record.root / "runtime" / "set-aside"


def state(record: Record) -> dict:
    return record.setting(KEY) or {}


def others(project: Path, agent: str) -> tuple[list[Path], list[Path]]:
    provider = PROVIDERS[agent]()
    skills = [d for home in dict.fromkeys(provider.skill_homes(project)) if home.is_dir() for d in sorted(home.iterdir()) if not d.name.startswith("journal")]
    hooks = [f for f in provider.hook_files(project) if kept(read_json(f, {})) != read_json(f, {})]
    return skills, hooks


def kept(settings) -> dict:
    if not isinstance(settings, dict) or not isinstance(settings.get("hooks"), dict):
        return settings
    ours = {event: [b for b in blocks if journal_hook(json.dumps(b))] for event, blocks in settings["hooks"].items()}
    return {**settings, "hooks": {event: blocks for event, blocks in ours.items() if blocks}}


def set_aside(record: Record, project: Path, agent: str) -> str:
    put_back(record)
    skills, hooks = others(project, agent)
    folder = place(record)
    folder.mkdir(parents=True, exist_ok=True)
    moved = []
    for i, skill in enumerate(skills):
        to = folder / f"skill-{i}-{skill.name}"
        shutil.move(str(skill), str(to))
        moved.append({"from": str(skill), "to": str(to)})
    for i, f in enumerate(hooks):
        to = folder / f"hooks-{i}-{f.name}"
        shutil.copy2(f, to)
        f.write_text(json.dumps(kept(read_json(f, {})), indent=2) + "\n")
        moved.append({"from": str(f), "to": str(to), "copy": True})
    record.set_setting(KEY, {**state(record), "moved": moved, "last": True})
    return f"set aside {len(skills)} other skills and the other hooks in {len(hooks)} " + ("file" if len(hooks) == 1 else "files") + ", until the journal stops"


def put_back(record: Record) -> int:
    moved = state(record).get("moved") or []
    for m in moved:
        kept_at, home = Path(m["to"]), Path(m["from"])
        if not (kept_at.exists() or kept_at.is_symlink()):
            continue
        home.parent.mkdir(parents=True, exist_ok=True)
        if m.get("copy"):
            shutil.copy2(kept_at, home)
            kept_at.unlink()
        elif not (home.exists() or home.is_symlink()):
            shutil.move(str(kept_at), str(home))
    if moved:
        record.set_setting(KEY, {**state(record), "moved": []})
    return len(moved)


def remember(record: Record, answer: bool) -> None:
    record.set_setting(KEY, {**state(record), "last": answer})
