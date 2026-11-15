from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ImageTagRequestNudge(NudgeDeclaration):
    """The nudge messages.tag_the_image."""

    key = "messages.tag_the_image"
    type = NudgeType.STEERING
    text = "message:{message} has image \"{name}\": tag it with what it shows"
    required_command = "journal message tag {message}"
