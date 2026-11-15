from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.sequences.rules.unstarted_step_rule import UnstartedStepRule


class UnstartedStepNeeds(RuleNeedSource):
    """The block UnstartedStepRule opens, planned for the new driver as today's rule opens it."""

    rule = UnstartedStepRule
    rank = "sequences.untaken-step"
