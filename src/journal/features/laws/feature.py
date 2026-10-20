from journal.features.feature import Feature
from journal.features.laws.listeners.judge_dispatch import JudgeDispatch
from journal.features.laws.listeners.measure_result import MeasureResult
from journal.engine.nudge import Nudge


class Laws(Feature):
    """The journal's law: what binds every agent and cannot be switched off."""

    name = "laws"
    title = "Journal laws"
    help = "A dispatch without a model or a job is refused; a large result is named."
    listeners = (JudgeDispatch, MeasureResult)

    NO_MODEL = Nudge(name, "no_model", "the dispatch names no model", "name the least expensive model that reliably fits the work")
    NO_PROFILE = Nudge(name, "no_profile", "the dispatch names no profile of this project: {{asked}}", "a subagent is one of the project's profiles, never a generic agent: {{profiles}}")
    NO_JOB = Nudge(name, "no_job", "the dispatch binds the agent to no concrete job", "give it a description and a bounded prompt")
    LARGE_RESULT = Nudge(name, "large_result", "that result was {{lines}} lines, and every line stays in the context", "cap output with grep, head or tail next time")
    nudges = (NO_MODEL, NO_PROFILE, NO_JOB, LARGE_RESULT)
