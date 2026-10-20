from journal.features.feature import Feature
from journal.features.laws.support.laws_conduct import LawsConduct
from journal.engine.nudge import Nudge


class Laws(Feature):
    """The journal's law: what binds every agent and cannot be switched off."""

    name = "laws"
    title = "Journal laws"
    help = "A dispatch without a model or a job is refused; a large result is named."
    conduct = (LawsConduct,)

    NAME_THE_MODEL = Nudge(name, "name_the_model", "the dispatch names no model", "name the least expensive model that reliably fits the work")
    NAME_A_PROFILE = Nudge(name, "name_a_profile", "the dispatch names no profile of this project: {{asked}}", "a subagent is one of the project's profiles, never a generic agent: {{profiles}}")
    BIND_THE_JOB = Nudge(name, "bind_the_job", "the dispatch binds the agent to no concrete job", "give it a description and a bounded prompt")
    CAP_THE_OUTPUT = Nudge(name, "cap_the_output", "that result was {{lines}} lines, and every line stays in the context", "cap output with grep, head or tail next time")
    nudges = (NAME_THE_MODEL, NAME_A_PROFILE, BIND_THE_JOB, CAP_THE_OUTPUT)
