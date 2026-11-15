from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MainWorkersRefusedNudge(NudgeDeclaration):
    """The nudge workers.main_sends_no_workers."""

    key = "workers.main_sends_no_workers"
    type = NudgeType.REFUSAL
    text = "The main agent sends no workers here: {then}"
