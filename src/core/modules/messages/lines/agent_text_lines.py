from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.messages.rules.agent_text_rule import AgentTextRule


class AgentTextLines(RuleLineSource):
    """The lines of the hints about the agent's own text, in today's words of AgentTextRule."""

    rule = AgentTextRule
