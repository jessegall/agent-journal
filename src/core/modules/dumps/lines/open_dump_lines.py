from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.dumps.rules.open_dump_rule import OpenDumpRule


class OpenDumpLines(RuleLineSource):
    """The lines of OpenDumpRule, in today's words."""

    rule = OpenDumpRule
