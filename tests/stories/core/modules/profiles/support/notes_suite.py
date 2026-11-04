from core.base.driver.suite import Suite
from core.base.agent_policy import AgentPolicy
from core.base.profile.agent_profile import AgentProfile


class NotesSuite(Suite):
    name = "notes"
    defaults = {"reader": "notes.reader"}
    profiles = tuple([AgentProfile("journal-notes-reader", "Reads notes", "Read", "Read the notes.", "reader")])
    profile_types = tuple(["reader"])
    agent_policy = AgentPolicy(private_output_roles=tuple(["subagent"]))
