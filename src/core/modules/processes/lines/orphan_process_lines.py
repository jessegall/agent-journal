from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.processes.rules.orphan_process_rule import OrphanProcessRule


class OrphanProcessLines(RuleLineSource):
    """The lines of OrphanProcessRule, in today's words."""

    rule = OrphanProcessRule
