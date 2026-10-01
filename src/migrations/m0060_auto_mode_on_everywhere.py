from pathlib import Path

from controllers.types import environment_records

AUTO = "work_tracking.auto"


def run(root: Path) -> list[str]:
    switched = []
    for record in environment_records(Path(root)):
        kept = record.setting("features", {})
        if kept.get(AUTO) is False:
            record.set_setting("features", {**kept, AUTO: True})
            switched.append(f"{record.env}: auto mode on")
    return switched
