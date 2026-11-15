from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SleepRefusedNudge(NudgeDeclaration):
    """The nudge processes.sleep_refused."""

    key = "processes.sleep_refused"
    type = NudgeType.REFUSAL
    text = "No sleeps: you are told when a run ends"
