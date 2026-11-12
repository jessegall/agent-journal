from engine.driver.driver import Driver
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from engine.enums.agent_role import AgentRole


class MainDriver(Driver):
    """Drives the coding suite's main agent: what it may do comes from its workflow controls, not from a mode."""

    name = "coding.main"
    suite_name = CODING_SUITE_NAME
    role = AgentRole.MAIN
    opening_lines = ["You are the main agent: what you may do is set by the work controls of this environment; read them with journal setting show"]
