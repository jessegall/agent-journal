from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.drivers.subagent.rules.subagent_write_rule import SubagentWriteRule
from core.base.agent_role import AgentRole


class SubagentDriver(Driver):
    """Drives a subagent the coding suite's main agent sends, which reads and searches for it."""

    name = "coding.subagent"
    suite = CodingSuite
    role = AgentRole.SUBAGENT
    permanent_rules = [SubagentWriteRule]
