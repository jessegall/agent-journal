from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MergerPassedNudge(NudgeDeclaration):
    """The nudge workers.merger_passed."""

    key = "workers.merger_passed"
    type = NudgeType.STEERING
    text = "The merger passed worker:{worker} to you: its merge waits on you"
    plural_text = "the merger leaves workers {worker} to you: their merges wait on you"
    id_field = "worker"
    wakes_agent = True
