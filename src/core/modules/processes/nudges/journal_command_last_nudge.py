from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalCommandLastNudge(NudgeDeclaration):
    """The nudge processes.journal_command_last."""

    key = "processes.journal_command_last"
    type = NudgeType.REFUSAL
    text = "A journal command cannot follow a long command or run in a loop: put it on its own line"
