from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.reply_note_rule import ReplyNoteRule


class ReplyNoteLines(RuleLineSource):
    """The lines of the note under a reply, in today's words of ReplyNoteRule."""

    rule = ReplyNoteRule
