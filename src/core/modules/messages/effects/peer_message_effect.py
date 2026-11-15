from engine.rule_backed.rule_effect import RuleEffect
from core.modules.messages.rules.peer_message_rule import PeerMessageRule


class PeerMessageEffect(RuleEffect):
    """The effect that delivers a message between agents, as today's PeerMessageRule runs it."""

    rule = PeerMessageRule
