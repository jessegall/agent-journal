from engine.enums.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class MessageReactionNudge(NudgeDeclaration):
    """The nudge messages.reaction."""

    key = "messages.reaction"
    delivery = LineDelivery.WAKE_HOOK
    type = NudgeType.STEERING
    text = "The user reacted to message:{message}: check the reaction"
    wakes_agent = True
    plural_text = "the user reacted to messages {message}"
    id_field = "message"
