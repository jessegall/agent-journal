from collections.abc import Iterable

from core.base.caller.process_table import ProcessTable
from core.modules.agents.models.agent import Agent


class GoneAgents:
    """Which of the given agents had a recorded process that no longer runs; an agent with none recorded is not
    among them, since nothing says it is gone."""

    def __init__(self, processes: ProcessTable) -> None:
        self.processes = processes

    def of(self, agents: Iterable[Agent]) -> list[Agent]:
        recorded = [agent for agent in agents if agent.pid is not None and agent.process_started_at is not None]
        if not recorded:
            return []
        running = {(row.pid, int(row.started_at.value.timestamp())) for row in self.processes.rows()}
        return [agent for agent in recorded if agent.process_started_at is not None and (agent.pid, int(agent.process_started_at.value.timestamp())) not in running]
