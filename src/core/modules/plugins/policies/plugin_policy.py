from engine.rule_backed.rule_policy import RulePolicy
from core.modules.plugins.rules.plugin_rule import PluginRule


class PluginPolicy(RulePolicy):
    """The refusal of PluginRule, with today's text, as a policy of the new driver."""

    rule = PluginRule
    rank = "plugins.policies"
