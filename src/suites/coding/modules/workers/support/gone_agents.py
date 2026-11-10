from collections.abc import Iterable

from engine.caller.process_table import ProcessTable
from core.modules.agents.models.agent import Agent


class GoneAgents:
    """Find agents whose recorded processes are not running."""

    def __init__(self, processes: ProcessTable) -> None:
        self.processes = processes

    def find(self, agents: Iterable[Agent]) -> list[Agent]:
        recorded = [agent for agent in agents if agent.pid is not None and agent.process_started_at is not None]
        if not recorded:
            return []
        running = {(row.pid, int(row.started_at.value.timestamp())) for row in self.processes.rows()}
        return [agent for agent in recorded if agent.process_started_at is not None and (agent.pid, int(agent.process_started_at.value.timestamp())) not in running]
