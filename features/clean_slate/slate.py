import json
import shutil
import subprocess
from pathlib import Path

from engine.record import Record
from engine.wording import plural
from engine.stored import read_json
from providers import PROVIDERS
from providers.base import journal_hook

KEY = "clean_slate"


def place(record: Record) -> Path:
    return record.root / "runtime" / "set-aside"


def state(record: Record) -> dict:
    return record.setting(KEY) or {}


def others(project: Path, agent: str) -> list[Path]:
    return [f for f in PROVIDERS[agent]().hook_files(project) if kept(read_json(f, {})) != read_json(f, {})]


def git(folder: Path, *args: str) -> str:
    done = subprocess.run(["git", "-C", str(folder), *args], capture_output=True, text=True, timeout=30)
    return done.stdout if done.returncode == 0 else ""


def hide(folder: Path, files: list[str], hidden: bool) -> None:
    if files:
        git(folder, "update-index", "--skip-worktree" if hidden else "--no-skip-worktree", "--", *files)


def kept(settings) -> dict:
    if not isinstance(settings, dict) or not isinstance(settings.get("hooks"), dict):
        return settings
    ours = {event: [b for b in blocks if journal_hook(json.dumps(b))] for event, blocks in settings["hooks"].items()}
    return {**settings, "hooks": {event: blocks for event, blocks in ours.items() if blocks}}


def set_aside(record: Record, project: Path, agent: str) -> str:
    put_back(record)
    hooks = others(project, agent)
    folder = place(record)
    folder.mkdir(parents=True, exist_ok=True)
    moved = []
    try:
        for i, f in enumerate(hooks):
            to = folder / f"hooks-{i}-{f.name}"
            shutil.copy2(f, to)
            moved.append({"from": str(f), "to": str(to), "copy": True})
            f.write_text(json.dumps(kept(read_json(f, {})), indent=2) + "\n")
    except Exception as error:
        record.set_setting(KEY, {**state(record), "moved": moved})
        put_back(record)
        return f"nothing set aside, everything is where it was: {error}"
    record.set_setting(KEY, {**state(record), "moved": moved, "last": True})
    return f"set aside the other hooks in {plural(len(hooks), 'file')} until the journal stops"


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
            hide(home.parent, m.get("tracked") or [], False)
    if moved:
        record.set_setting(KEY, {**state(record), "moved": []})
    return len(moved)


def remember(record: Record, answer: bool) -> None:
    record.set_setting(KEY, {**state(record), "last": answer})
