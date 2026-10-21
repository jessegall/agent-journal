import time

from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.statistics import Statistics


class CountProfileUse(AgentListener[ToolStarting]):
    """A subagent dispatched by a profile counts one use of it and when, so the profiles page reads the statistics and never the record of tool calls."""

    def __init__(self, statistics: Statistics) -> None:
        self.statistics = statistics

    def handle(self, event: ToolStarting) -> None:
        name = event.call.input.get("subagent_type", "") if event.call.tool in ("Agent", "Task") else ""
        if not name:
            return
        actor = Actor.agent(event.session)
        self.statistics.counted(f"profiles.{name}.uses", actor)
        self.statistics.set(f"profiles.{name}.last_used", int(time.time()), actor)
