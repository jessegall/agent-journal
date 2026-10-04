from pathlib import Path

from controllers.types import environment_records
from features.clean_slate.slate import KEY, keep_moved, moved


def run(root: Path) -> list[str]:
    folded = []
    for record in environment_records(Path(root)):
        kept = record.setting(KEY) or {}
        if kept.get("moved"):
            keep_moved(record, [*moved(record), *kept["moved"]])
            record.set_setting(KEY, {key: value for key, value in kept.items() if key != "moved"})
            folded.append(f"{record.env}: clean slate's set-aside list moved into its file")
    return folded
