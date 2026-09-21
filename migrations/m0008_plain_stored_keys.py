import json
from pathlib import Path

from engine.record import RESOURCES, Record
from engine.stored import write_text

EVENT_KEY = ('"heard": ', '"handled": ')
AGENT_KEY = ('"said": ', '"last_message": ')
CHECK_KEY = ('"said": ', '"output": ')
SETTINGS = ("work_tracking", "said_after", "name_work_every")


def rewrite(f: Path, old: str, new: str) -> bool:
    text = f.read_text()
    if old not in text:
        return False
    write_text(f, text.replace(old, new))
    return True


def settings(f: Path) -> bool:
    try:
        saved = json.loads(f.read_text())
    except (OSError, ValueError):
        return False
    feature, old, new = SETTINGS
    values = saved.get(feature)
    if not isinstance(values, dict) or old not in values:
        return False
    values[new] = values.pop(old)
    write_text(f, json.dumps(saved, indent=2) + "\n")
    return True


def rows_in(folder: Path, old: str, new: str) -> int:
    return sum(rewrite(f, old, new) for f in sorted(folder.glob("*.md"))) if folder.is_dir() else 0


def run(root: Path) -> str:
    root = Path(root)
    logs, kept = 0, 0
    rows = rows_in(root / RESOURCES / "check", *CHECK_KEY) + rows_in(root / "check", *CHECK_KEY)
    for home in sorted(p for p in (root / "environments").glob("*") if p.is_dir()):
        events = home / "events.jsonl"
        if events.is_file():
            with Record(root, home.name).locked():
                logs += rewrite(events, *EVENT_KEY)
        rows += rows_in(home / "agent", *AGENT_KEY)
        if (home / "settings.json").is_file():
            kept += settings(home / "settings.json")
    return f"{logs} event logs, {rows} rows and {kept} settings files use the plain key names"
