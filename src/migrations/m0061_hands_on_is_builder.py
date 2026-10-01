from pathlib import Path

from controllers.types import environment_records

NAME = "work_modes"


def run(root: Path) -> list[str]:
    renamed = []
    for record in environment_records(Path(root)):
        kept = record.setting(NAME, {})
        if kept.get("mode") == "hands-on":
            record.set_setting(NAME, {**kept, "mode": "builder"})
            renamed.append(f"{record.env}: the work mode hands-on is now builder")
    return renamed
