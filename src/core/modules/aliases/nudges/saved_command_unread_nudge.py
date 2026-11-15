from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandUnreadNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_unread."""

    key = "aliases.saved_command_unread"
    type = NudgeType.REFUSAL
    text = "journal {name} needs --tail, --head or --cut A-B: its full output is too long to read"
