from dataclasses import dataclass

from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class WorkerRequest:
    """The profile, program and model a dispatch asks of its worker."""

    profile: str
    program: str
    model: str

    def matches(self, worker: Agent) -> bool:
        return (worker.profile, worker.program, worker.program_model) == (self.profile, self.program, self.model)
