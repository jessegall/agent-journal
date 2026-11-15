from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.processes.rules.reader_request_rule import ReaderRequestRule


class ReaderRequestNeeds(RuleNeedSource):
    """The block ReaderRequestRule opens, planned for the new driver as today's rule opens it."""

    rule = ReaderRequestRule
    rank = "processes.reader-request"
