from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.processes.rules.long_run_dock_rule import LongRunDockRule


class LongRunDockNeeds(RuleNeedSource):
    """The block LongRunDockRule opens, planned for the new driver as today's rule opens it."""

    rule = LongRunDockRule
    rank = "processes.output-title"
