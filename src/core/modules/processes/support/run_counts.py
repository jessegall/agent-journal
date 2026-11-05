from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process


class RunCounts:
    """A suite's optional command listings that count a run before it starts."""

    def line(self, process: Process) -> str:
        return ""

    def has_listing(self, process: Process, agent: Agent) -> bool:
        return False

    def count(self, process: Process, text: str) -> int:
        return 0
