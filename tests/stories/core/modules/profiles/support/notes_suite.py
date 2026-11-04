from core.base.driver.suite import Suite
from core.base.agent_policy import AgentPolicy
from core.base.profile.agent_profile import AgentProfile
from core.base.template.template_declaration import TemplateDeclaration


class NotesSuite(Suite):
    name = "notes"
    defaults = {"reader": "notes.reader"}
    profiles = tuple([AgentProfile("journal-notes-reader", "Reads notes", "Read", "Read the notes.", "reader")])
    profile_types = tuple(["reader"])
    templates = tuple([TemplateDeclaration(title="Summarize notes", brief="Summarize the notes.", targets=tuple(["doc"]))])
    agent_policy = AgentPolicy(private_output_roles=tuple(["subagent"]))
