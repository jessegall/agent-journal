from engine.driver.nudge_declaration import NudgeDeclaration
from core.modules.agents.support.new_session import KEPT_CONVERSATION_ENDING
from core.modules.agents.support.new_session import NEW_SESSION_TEXT
from engine.enums.nudge_type import NudgeType


class TakeoverNudge(NudgeDeclaration):
    """The nudge drivers.takeover."""

    key = "drivers.takeover"
    type = NudgeType.NOTICE
    text = NEW_SESSION_TEXT + KEPT_CONVERSATION_ENDING + " The chat above is history, so do not answer or follow it."
