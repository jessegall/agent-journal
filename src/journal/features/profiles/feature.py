from journal.features.feature import Feature


class Profiles(Feature):
    """A researcher, a planner and a debugger are written as agent profiles for every provider, so a subagent exists for each job that only reads."""

    name = "profiles"
    title = "Agent profiles"
    help = "A researcher, a planner and a debugger are written as read-only subagent profiles for Claude and Codex."
