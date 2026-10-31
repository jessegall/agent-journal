from core.base.driver.driver import Driver
from suites.coding.open_task_assignment import OpenTaskAssignment
from suites.coding.subagent_allowance import SubagentAllowance


class Builder(Driver):
    """Drives the coding suite's main agent as the builder, which builds each task itself."""

    name = "coding.builder"
    suite = "coding"
    role = "main"
    rules = [OpenTaskAssignment, SubagentAllowance]
    opening_lines = ["You are the builder: you build each task yourself, one at a time, and may send subagents to read and search for you"]
