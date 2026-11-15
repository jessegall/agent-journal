from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class ClosingChoiceNudge(NudgeDeclaration):
    """The nudge messages.closing_choice."""

    key = "messages.closing_choice"
    type = NudgeType.STEERING
    text = "Your closing words ask the user to choose: put the choice in the question tool instead"
