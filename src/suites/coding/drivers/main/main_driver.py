from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class MainDriver(Driver):
    """Drives the coding suite's main agent: what it may do comes from its workflow controls, not from a mode."""

    name = "coding.main"
    suite = CodingSuite
    role = AgentRole.MAIN
    rules = []
    opening_lines = ["You are the main agent: what you may do is set by the work controls of this environment; read them with journal setting show"]
