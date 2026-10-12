from pathlib import Path

from declaring.details import values_of
from engine import runtime
from engine.record import Record
from features.auto_update.details import AutoUpdateDetails


def followed_branch(root: Path) -> str:
    """The branch this journal upgrades from instead of the releases, named in auto_update.branch; empty while it follows the releases. The declaration is read straight from the feature's details, since the installer asks this before the journal is up and its features are wired."""
    place = Path(root)
    return str(values_of(AutoUpdateDetails.name, list(AutoUpdateDetails.settings), Record(place, runtime.env(place))).branch)
