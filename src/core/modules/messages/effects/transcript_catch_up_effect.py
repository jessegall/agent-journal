from engine.rule_backed.rule_effect import RuleEffect
from core.modules.messages.rules.transcript_message_rule import TranscriptMessageRule


class TranscriptCatchUpEffect(RuleEffect):
    """The effect that catches the chat up with the transcript, as today's TranscriptMessageRule runs it."""

    rule = TranscriptMessageRule
