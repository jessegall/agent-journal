from pathlib import Path

from controllers.types import environment_records
from engine.record import Record
from engine.stored import read_json, write_json


def run(root: Path) -> str:
    """Lifts every switch a user set on a nudge to the project, where they now live: a nudge silenced in any one environment stays silent in all of them, since silencing is what was asked for and un-silencing never was."""
    silenced = {key: on for record in environment_records(Path(root)) for key, on in switches(record).items() if not on}
    if not silenced:
        return "no nudge had been switched off, so none had to be carried to the project"
    file = Path(root) / "settings.json"
    settings = read_json(file, dict, {})
    settings["features"] = {**silenced, **settings.get("features", {})}
    write_json(file, settings)
    return f"{len(silenced)} nudges switched off in one environment are now switched off for the whole project"


def switches(record: Record) -> dict:
    """What a record says about the nudges of its features, by the dotted key a switch is kept under."""
    return {key: value for key, value in record.features.items() if "." in key}
