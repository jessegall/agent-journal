from journal.features.feature import Feature
from journal.features.profiles.listeners.count_profile_use import CountProfileUse
from journal.engine.nudge import Nudge
from journal.features.profiles.profiles_conduct import ProfilesConduct
from journal.features.profiles.support.profiles_data_reader import ProfilesDataReader
from journal.features.profiles.support.profiles_data import ProfilesData
from journal.support.option import Option


class Profiles(Feature[ProfilesData]):
    """A researcher, a planner and a debugger are written as agent profiles for every provider, so a subagent exists for each job that only reads."""
    CLAUDE_MODEL = Option("profiles.model.claude", "Model on Claude", "The model the journal's subagent profiles run on under Claude Code", "sonnet", kind="model", provider="claude")
    CODEX_MODEL = Option("profiles.model.codex", "Model on Codex", "The model the journal's subagent profiles run on under Codex", "gpt-6.1-sol", kind="model", provider="codex")

    name = "profiles"
    title = "Agent profiles"
    options = (CLAUDE_MODEL, CODEX_MODEL)
    listeners = (CountProfileUse,)
    data = (ProfilesDataReader,)
    conduct = (ProfilesConduct,)
    WORKER_PROFILE_MISUSE = Nudge(name, "worker_profile_is_not_a_subagent", "{{name}} is a worker profile: it writes", "dispatch a worker with `journal worker dispatch \"<Name>\" --task <n> --profile {{name}}`, not a subagent", repeat_interval=0)
    nudges = (WORKER_PROFILE_MISUSE,)
    help = "A researcher, a planner and a debugger are written as read-only subagent profiles for Claude and Codex."
