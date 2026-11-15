from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.processes.rules.alias_suggestion_rule import AliasSuggestionRule


class AliasSuggestionLines(RuleLineSource):
    """The lines of AliasSuggestionRule, in today's words."""

    rule = AliasSuggestionRule
