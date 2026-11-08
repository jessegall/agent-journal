from core.base.agent_role import AgentRole
from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.support.context_line import CONTEXT_LINE


class HelperDriver(Driver):
    """Drives a helper the coding suite's agents start, which reads and reports."""

    name = "coding.helper"
    suite = CodingSuite
    role = AgentRole.HELPER
    rules = []
    opening_lines = [CONTEXT_LINE]
