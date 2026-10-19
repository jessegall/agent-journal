from journal.features.feature import Feature
from journal.features.profiles.listeners.count_profile_use import CountProfileUse
from journal.features.profiles.listeners.refuse_worker_as_subagent import RefuseWorkerAsSubagent
from journal.models.option import Option


class Profiles(Feature):
    """A researcher, a planner and a debugger are written as agent profiles for every provider, so a subagent exists for each job that only reads."""

    name = "profiles"
    title = "Agent profiles"
    CLAUDE_MODEL = Option("profiles.model.claude", "Model on Claude", "The model the researcher, planner and debugger run on under Claude Code", "sonnet", kind="model", provider="claude")
    CODEX_MODEL = Option("profiles.model.codex", "Model on Codex", "The model the researcher, planner and debugger run on under Codex", "gpt-6-sol", kind="model", provider="codex")
    options = (CLAUDE_MODEL, CODEX_MODEL)
    listeners = (RefuseWorkerAsSubagent, CountProfileUse)
    help = "A researcher, a planner and a debugger are written as read-only subagent profiles for Claude and Codex."
