from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.workers.listeners.mark_subagents import DISPATCHING
from journal.repositories.settings import Settings
from journal.support.decision import Decision
from journal.support.subagents import Subagents


class HoldPastMostSubagents(AgentListener[ToolStarting]):
    """A subagent started while the most allowed at once are running is held until one finishes; none means no limit."""

    blocking = True

    def __init__(self, subagents: Subagents, settings: Settings) -> None:
        self.subagents, self.settings = subagents, settings

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.workers.feature import Workers
        if event.tool not in DISPATCHING or event.subagent:
            return None
        most = int(self.settings.option(Workers.MOST_SUBAGENTS))
        running = self.subagents.running(event.session)
        if not most or running < most:
            return None
        return Decision.refuse(Workers.TOO_MANY_SUBAGENTS.about(running=running).rendered())
