from core.base.driver.driver import Driver
from suites.coding.coding_suite import CodingSuite
from suites.coding.drivers.builder.rules.open_task_assignment_rule import OpenTaskAssignmentRule
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class BuilderDriver(Driver):
    """Drives the coding suite's main agent as the builder, which builds tasks itself or gives them to workers."""

    name = "coding.builder"
    suite = CodingSuite
    role = AgentRole.MAIN
    rules = [OpenTaskAssignmentRule]
    opening_lines = ["You are the builder: you build tasks yourself or give them to workers, and may start helpers with journal helper start to read and search for you; the program's own subagents are refused"]
