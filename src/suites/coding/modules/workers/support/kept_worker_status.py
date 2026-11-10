from dataclasses import dataclass

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


@dataclass(frozen=True)
class KeptWorkerStatus:
    """A kept worker whose last worktree was merged or released: it stays idle until a job cuts it a new one."""

    worker: Agent

    @property
    def line(self) -> str:
        return (f"{AgentLabel.from_agent(self.worker).text} is idle with no worktree: journal worker send {self.worker.number} \"<job>\" "
                "cuts a new one from the environment's branch")

    def listed(self) -> dict[str, object]:
        return {"worker_id": self.worker.id, "worker_number": self.worker.number, "current_task": None, "idle": True}
