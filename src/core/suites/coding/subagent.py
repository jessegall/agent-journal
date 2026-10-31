from core.base.driver.driver import Driver
from core.suites.coding.reads_only_limit import ReadsOnlyLimit


class Subagent(Driver):
    """Drives a subagent the coding suite's main agent sends, which reads and searches for it."""

    name = "coding.subagent"
    suite = "coding"
    role = "subagent"
    limits = [ReadsOnlyLimit]
