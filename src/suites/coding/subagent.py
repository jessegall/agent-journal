from core.base.driver.driver import Driver
from suites.coding.subagent_write_limit import SubagentWriteLimit


class Subagent(Driver):
    """Drives a subagent the coding suite's main agent sends, which reads and searches for it."""

    name = "coding.subagent"
    suite = "coding"
    role = "subagent"
    limits = [SubagentWriteLimit]
