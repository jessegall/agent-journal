from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.usage.support.agent_facts import AgentFacts


@dataclass(frozen=True)
class AgentFactsList:
    """The facts of the agents still running in an environment."""

    agents: Sequence[AgentFacts]

    def line(self) -> str:
        return "\n".join(f"agent {facts.agent_id}: {facts.model or 'model not reported'}, task {facts.task_id or 'none'}" for facts in self.agents) or "no agent is running"
