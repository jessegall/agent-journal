from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ExceptionLineNudge(NudgeDeclaration):
    """The nudge developer.exception."""

    key = "developer.exception"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "journal-exception:{exception} was recorded: read it, then fix or report the cause"
    turn_limited = False
    wakes_agent = True
    plural_text = "journal-exceptions {exception} were recorded"
    id_field = "exception"
