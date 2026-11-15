from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MoveBanNudge(NudgeDeclaration):
    """The nudge processes.do_not_move."""

    key = "processes.do_not_move"
    type = NudgeType.REFUSAL
    text = "Do not cd: you are in {folder}; use paths, or a tool flag such as npm --prefix"
