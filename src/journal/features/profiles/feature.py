from journal.features.feature import Feature
from journal.models.option import Option


class Profiles(Feature):
    """A researcher, a planner and a debugger are written as agent profiles for every provider, so a subagent exists for each job that only reads."""

    name = "profiles"
    title = "Agent profiles"
    CLAUDE_MODEL = Option("profiles.model.claude", "Model on Claude", "The model the researcher, planner and debugger run on under Claude Code", "sonnet", kind="choice", choices=("haiku", "sonnet", "opus"))
    CODEX_MODEL = Option("profiles.model.codex", "Model on Codex", "The model the researcher, planner and debugger run on under Codex", "gpt-6-sol", kind="text")
    options = (CLAUDE_MODEL, CODEX_MODEL)
    help = "A researcher, a planner and a debugger are written as read-only subagent profiles for Claude and Codex."
