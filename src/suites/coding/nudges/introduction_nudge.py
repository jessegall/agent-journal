from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class IntroductionNudge(NudgeDeclaration):
    """The nudge coding.introduce_yourself."""

    key = "coding.introduce_yourself"
    type = NudgeType.STEERING
    text = "Introduce yourself in the chat in one or two lines, then ask what to do unless the user already asked"
