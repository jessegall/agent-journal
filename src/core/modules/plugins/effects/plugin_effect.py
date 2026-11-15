from engine.rule_backed.rule_effect import RuleEffect
from core.modules.plugins.rules.plugin_rule import PluginRule


class PluginEffect(RuleEffect):
    """The effect of PluginRule, as today's rule runs it."""

    rule = PluginRule
