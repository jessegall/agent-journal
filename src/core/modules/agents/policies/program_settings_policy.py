from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.agents.rules.program_settings_rule import ProgramSettingsRule


class ProgramSettingsPolicy(RulePolicy):
    """The refusal of ProgramSettingsRule, with today's text, as a policy of the new driver."""

    rule = ProgramSettingsRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
