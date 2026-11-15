from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule


class ForeignHooksLines(RuleLineSource):
    """The lines of ForeignHooksRule, in today's words."""

    rule = ForeignHooksRule
