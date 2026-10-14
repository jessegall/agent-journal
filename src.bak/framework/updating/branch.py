from pathlib import Path

from engine import runtime
from engine.record import Record


def followed_branch(root: Path) -> str:
    """The branch this journal upgrades from instead of the releases, named in auto_update.branch; empty while it follows the releases."""
    place = Path(root)
    return str(Record(place, runtime.env(place)).setting("auto_update", {}).get("branch", ""))
