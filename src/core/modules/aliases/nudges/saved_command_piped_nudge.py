from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class SavedCommandPipedNudge(NudgeDeclaration):
    """The nudge aliases.saved_command_piped."""

    key = "aliases.saved_command_piped"
    type = NudgeType.REFUSAL
    text = "journal {name} takes no pipe: use --tail, --head or --cut A-B; the full output is kept"
