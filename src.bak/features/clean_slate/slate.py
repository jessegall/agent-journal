import json
import shutil
from pathlib import Path

from framework.lanes import served
from payload import journal_hook
from resources.files import RUNTIME
from resources.text import plural
from serving import SERVED, JournalRoot, Providers, ReadSessions

KEY = "clean_slate"


def files(record) -> JournalRoot:
    return served(record, JournalRoot, KEY)


def place(record) -> Path:
    return Path(record.root) / RUNTIME / "set-aside"


def state(record) -> dict:
    return record.setting(KEY) or {}


def listed(record) -> Path:
    return place(record) / "moved.json"


def moved(record) -> list[dict]:
    return files(record).read_json(str(listed(record)), list, [])


def keep_moved(record, entries: list[dict]) -> None:
    place(record).mkdir(parents=True, exist_ok=True)
    files(record).write_json(str(listed(record)), entries)


def others(record, project: Path, agent: str) -> list[Path]:
    root = files(record)
    return [f for f in SERVED.given(Providers).of(agent).hook_files(project) if kept(root.read_json(str(f), dict, {})) != root.read_json(str(f), dict, {})]


def held(record, project: Path, agent: str) -> list[dict]:
    hook_files = {str(f) for f in SERVED.given(Providers).of(agent).hook_files(project)}
    return [m for m in moved(record) if m["from"] in hook_files]


def kept(settings) -> dict:
    if not isinstance(settings, dict) or not isinstance(settings.get("hooks"), dict):
        return settings
    ours = {event: [b for b in blocks if journal_hook(json.dumps(b))] for event, blocks in settings["hooks"].items()}
    return {**settings, "hooks": {event: blocks for event, blocks in ours.items() if blocks}}


def set_aside(record, project: Path, agent: str) -> str:
    put_back(record)
    already = moved(record)
    hooks = [f for f in others(record, project, agent) if str(f) not in {m["from"] for m in already}]
    if not hooks and held(record, project, agent):
        return "the other hooks are already set aside until the journal stops"
    folder = place(record)
    folder.mkdir(parents=True, exist_ok=True)
    entries, root = [], files(record)
    try:
        for i, f in enumerate(hooks, len(already)):
            to = folder / f"hooks-{i}-{f.name}"
            shutil.copy2(f, to)
            entries.append({"from": str(f), "to": str(to), "copy": True})
            root.write_json(str(f), kept(root.read_json(str(f), dict, {})), indent=2)
    except Exception as error:
        restore(entries, root)
        return f"nothing set aside, everything is where it was: {error}"
    keep_moved(record, already + entries)
    remember(record, True)
    return f"set aside the other hooks in {plural(len(hooks), 'file')} until the journal stops"


def without_hooks(settings: dict) -> dict:
    return {key: value for key, value in settings.items() if key != "hooks"}


def restore_hooks(kept_at: Path, home: Path, root: JournalRoot) -> None:
    original, current = root.read_json(str(kept_at), dict, {}), root.read_json(str(home), dict, {})
    if not current or without_hooks(current) == without_hooks(original):
        shutil.copy2(kept_at, home)
        return
    root.write_json(str(home), {**current, "hooks": original.get("hooks", {})}, indent=2)


def put_back(record) -> int:
    if served(record, ReadSessions, KEY).running():
        return 0
    entries = moved(record)
    restore(entries, files(record))
    if entries:
        keep_moved(record, [])
    return len(entries)


def put_back_held(record, project: Path, agent: str) -> int:
    mine = held(record, project, agent)
    restore(mine, files(record))
    keep_moved(record, [m for m in moved(record) if m not in mine])
    return len(mine)


def restore(entries: list[dict], root: JournalRoot) -> None:
    for m in entries:
        kept_at, home = Path(m["to"]), Path(m["from"])
        if not (kept_at.exists() or kept_at.is_symlink()):
            continue
        home.parent.mkdir(parents=True, exist_ok=True)
        if m.get("copy"):
            restore_hooks(kept_at, home, root)
            kept_at.unlink()
        elif not (home.exists() or home.is_symlink()):
            shutil.move(str(kept_at), str(home))


def slate_of(record) -> bool:
    return bool(state(record).get("last", True))


def remember(record, answer: bool) -> None:
    record.change_setting(KEY, {"last": answer})
