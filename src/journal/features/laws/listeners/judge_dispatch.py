from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.support.profile_files import ProfileFiles

DISPATCH_TOOLS = frozenset({"Task", "Agent"})


class JudgeDispatch(AgentListener[ToolStarting]):
    """A subagent dispatch names its model, one of the project's profiles and a concrete job, or it does not run: a generic agent such as general-purpose is no profile."""

    blocking = True

    def __init__(self, profiles: ProfileFiles) -> None:
        self.profiles = profiles

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.laws.feature import Laws
        if event.tool not in DISPATCH_TOOLS:
            return None
        if not event.input.get("model"):
            return Decision.refuse(Laws.NAME_THE_MODEL.create().rendered())
        asked = event.input.get("subagent_type", "")
        if asked not in self.profiles.names():
            return Decision.refuse(Laws.NAME_A_PROFILE.create(asked=asked or "none", profiles=", ".join(self.profiles.subagents())).rendered())
        if not event.input.get("description") or not event.input.get("prompt"):
            return Decision.refuse(Laws.BIND_THE_JOB.create().rendered())
        return None
