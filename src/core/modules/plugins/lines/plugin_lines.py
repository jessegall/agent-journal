from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.plugins.rules.plugin_rule import PluginRule


class PluginLines(RuleLineSource):
    """The lines of PluginRule, in today's words."""

    rule = PluginRule
