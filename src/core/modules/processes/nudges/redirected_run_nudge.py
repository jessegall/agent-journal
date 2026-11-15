from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RedirectedRunNudge(NudgeDeclaration):
    """The nudge processes.redirected_run."""

    key = "processes.redirected_run"
    type = NudgeType.STEERING
    text = "{programs} is redirected to a file, so no reader sees it: run it without the redirect and read it by output number"
