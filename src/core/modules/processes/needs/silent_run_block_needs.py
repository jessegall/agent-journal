from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.processes.rules.silent_run_block_rule import SilentRunBlockRule


class SilentRunBlockNeeds(RuleNeedSource):
    """The block SilentRunBlockRule opens, planned for the new driver as today's rule opens it."""

    rule = SilentRunBlockRule
    rank = "processes.silent-run"
