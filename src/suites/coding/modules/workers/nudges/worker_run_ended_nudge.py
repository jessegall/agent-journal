from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerRunEndedNudge(NudgeDeclaration):
    """The nudge workers.run_ended."""

    key = "workers.run_ended"
    type = NudgeType.STEERING
    text = "Your run {output} ended: read it, then continue"
    plural_text = 'your runs {output} ended: read each, then go on'
    id_field = "output"
