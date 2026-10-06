import json
import shutil
import subprocess
from pathlib import Path

from engine.record import Record
from engine.sessions import Sessions
from engine.wording import plural
from engine.stored import read_json, write_json
from providers import PROVIDERS
from providers.base import journal_hook

KEY = "clean_slate"


def place(record: Record) -> Path:
    return record.root / "runtime" / "set-aside"


def state(record: Record) -> dict:
    return record.setting(KEY) or {}


def listed(record: Record) -> Path:
    return place(record) / "moved.json"


def moved(record: Record) -> list[dict]:
    return read_json(listed(record), list, []) + (state(record).get("moved") or [])


def keep_moved(record: Record, entries: list[dict]) -> None:
    place(record).mkdir(parents=True, exist_ok=True)
    write_json(listed(record), entries)
    if state(record).get("moved"):
        record.set_setting(KEY, {**state(record), "moved": []})


def others(project: Path, agent: str) -> list[Path]:
    return [f for f in PROVIDERS[agent]().hook_files(project) if kept(read_json(f, dict, {})) != read_json(f, dict, {})]


def held(record: Record, project: Path, agent: str) -> list[dict]:
    files = {str(f) for f in PROVIDERS[agent]().hook_files(project)}
    return [m for m in moved(record) if m["from"] in files]


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
    already = moved(record)
    hooks = [f for f in others(project, agent) if str(f) not in {m["from"] for m in already}]
    if not hooks and held(record, project, agent):
        return "the other hooks are already set aside until the journal stops"
    folder = place(record)
    folder.mkdir(parents=True, exist_ok=True)
    entries = []
    try:
        for i, f in enumerate(hooks, len(already)):
            to = folder / f"hooks-{i}-{f.name}"
            shutil.copy2(f, to)
            entries.append({"from": str(f), "to": str(to), "copy": True})
            write_json(f, kept(read_json(f, dict, {})), indent=2)
    except Exception as error:
        restore(entries)
        return f"nothing set aside, everything is where it was: {error}"
    keep_moved(record, already + entries)
    remember(record, True)
    return f"set aside the other hooks in {plural(len(hooks), 'file')} until the journal stops"


def put_back(record: Record) -> int:
    if Sessions(record.root).running():
        return 0
    entries = moved(record)
    restore(entries)
    if entries:
        keep_moved(record, [])
    return len(entries)


def put_back_held(record: Record, project: Path, agent: str) -> int:
    mine = held(record, project, agent)
    restore(mine)
    keep_moved(record, [m for m in moved(record) if m not in mine])
    return len(mine)


def restore(entries: list[dict]) -> None:
    for m in entries:
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


def slate_of(record: Record) -> bool:
    return bool(state(record).get("last", True))


def remember(record: Record, answer: bool) -> None:
    record.set_setting(KEY, {**state(record), "last": answer})
