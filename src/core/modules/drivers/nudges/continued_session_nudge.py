from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ContinuedSessionNudge(NudgeDeclaration):
    """The nudge drivers.continued_session."""

    key = "drivers.continued_session"
    type = NudgeType.NOTICE
    text = "You are resuming earlier session {agent}: tell the user in one line, in your voice, then continue the work in hand or ask what is next"
    turn_limited = False
