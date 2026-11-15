from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerCommittedNudge(NudgeDeclaration):
    """The nudge workers.committed."""

    key = "workers.committed"
    type = NudgeType.STEERING
    text = "The work of worker:{worker} is committed and ready to merge"
    turn_limited = False
    plural_text = 'the work of workers {worker} is committed and can be merged'
    id_field = "worker"
