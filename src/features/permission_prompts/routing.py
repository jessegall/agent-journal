from controllers.types import Environments
from engine.record import Record
from features.work_modes.details import ORCHESTRATOR
from features.work_modes.modes import mode_of
from features.work_tracking.auto import automatic
from resources.base import SYSTEM


def orchestrating(record) -> bool:
    """Whether this environment's agent runs on auto in orchestrator mode, so nothing waits on the user."""
    return automatic(record) and mode_of(record) == ORCHESTRATOR


def orchestrator_of(record) -> Record | None:
    """The environment whose orchestrating agent answers this environment's permission requests: the one that launched it, when it runs on auto in orchestrator mode."""
    place = Environments(record, actor=SYSTEM).rows.by_title(record.env)
    if not place or not place.owner or not place.launched_from:
        return None
    launcher = Record(record.root, place.launched_from)
    return launcher if orchestrating(launcher) else None
