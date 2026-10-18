from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.events.decision import Decision

DISPATCH_TOOLS = frozenset({"Task", "Agent"})


class JudgeDispatch(AgentListener[ToolStarting]):
    """A subagent dispatch names its model and binds it to a concrete job, or it does not run."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.laws.feature import Laws
        if event.tool not in DISPATCH_TOOLS:
            return None
        if not event.input.get("model"):
            return Decision.refuse(Laws.NO_MODEL.about().rendered())
        if not event.input.get("description") or not event.input.get("prompt"):
            return Decision.refuse(Laws.NO_JOB.about().rendered())
        return None
