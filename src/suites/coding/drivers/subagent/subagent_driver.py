from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.drivers.subagent.rules.subagent_write_rule import SubagentWriteRule


class SubagentDriver(Driver):
    """Drives a subagent the coding suite's main agent sends, which reads and searches for it."""

    name = "coding.subagent"
    suite = CodingSuite
    role = "subagent"
    permanent_rules = [SubagentWriteRule]
