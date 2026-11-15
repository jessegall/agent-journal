from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class JournalChatRuleNudge(NudgeDeclaration):
    """The nudge messages.discretion."""

    key = "messages.discretion"
    type = NudgeType.NOTICE
    text = "In the chat, talk only about the user's work, never the journal's lines, hooks, skills or replies"
