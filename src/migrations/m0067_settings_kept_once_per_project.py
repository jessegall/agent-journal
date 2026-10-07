import shutil
from pathlib import Path

from controllers.types import Features
from engine import attic, runtime
from engine.paths import environments
from engine.record import Record
from engine.settings_file import PROJECT_PARTS
from engine.stored import read_json, write_json
from resources.base import ENVIRONMENT, SYSTEM

ATTIC = "settings-before-project"


def run(root: Path) -> str:
    root = Path(root)
    homes = sorted((home for home in environments(root).glob("*") if home.is_dir()), key=lambda home: (home.name != runtime.env(root), home.name))
    if not homes:
        return "no environment held settings"
    project = read_json(root / "settings.json", dict, {})
    folded = {key: dict(value) for key in PROJECT_PARTS.kept if isinstance(value := project.get(key), dict)}
    for home in homes:
        own = with_switches(root, home)
        for key, parts in PROJECT_PARTS.kept.items():
            values = own.get(key) if isinstance(own.get(key), dict) else {}
            folded[key] = {**{part: values[part] for part in parts if part in values}, **folded.get(key, {})}
        kept(root, home)
    write_json(root / "settings.json", {**project, **{key: value for key, value in folded.items() if value}}, indent=2)
    return (f"the settings of {len(homes)} environments are kept once for the project, the {homes[0].name} environment's first; "
            f"every environment's own file as it was is kept in attic/{ATTIC}")


def with_switches(root: Path, home: Path) -> dict:
    own = read_json(home / "settings.json", dict, {})
    rows = {row.title: bool(row.enabled) for row in Features(Record(root, home.name), actor=SYSTEM).rows.every()}
    switches = own.get(Record.features) if isinstance(own.get(Record.features), dict) else {}
    return {**own, Record.features: {**switches, **rows}}


def kept(root: Path, home: Path) -> None:
    file = home / "settings.json"
    if not file.is_file():
        return
    copy = attic.folder(root) / ATTIC / f"{home.name}.json"
    copy.parent.mkdir(parents=True, exist_ok=True)
    if not copy.exists():
        shutil.copy2(file, copy)
    own = read_json(file, dict, {})
    write_json(file, {key: PROJECT_PARTS.split(key, value)[ENVIRONMENT] for key, value in own.items()}, indent=2)
