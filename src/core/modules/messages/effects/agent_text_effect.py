from engine.rule_backed.rule_effect import RuleEffect
from core.modules.messages.rules.agent_text_rule import AgentTextRule


class AgentTextEffect(RuleEffect):
    """The effect that keeps the agent's own text, as today's AgentTextRule runs it."""

    rule = AgentTextRule
