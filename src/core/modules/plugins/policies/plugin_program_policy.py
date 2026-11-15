from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.plugins.rules.plugin_program_rule import PluginProgramRule


class PluginProgramPolicy(RulePolicy):
    """The refusal of PluginProgramRule, with today's text, as a policy of the new driver."""

    rule = PluginProgramRule
    rank = "plugins.policies"
