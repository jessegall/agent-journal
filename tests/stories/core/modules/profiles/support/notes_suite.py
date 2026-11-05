from core.base.driver.suite import Suite
from core.base.agent_policy import AgentPolicy


class NotesSuite(Suite):
    name = "notes"
    defaults = {"reader": "notes.reader"}
    agent_policy = AgentPolicy(private_output_roles=tuple(["helper"]))
