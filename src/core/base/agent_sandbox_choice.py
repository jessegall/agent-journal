from collections.abc import Sequence
from typing import Any, Protocol


class SandboxedAgent(Protocol):
    """What the sandbox choice reads of an agent row."""

    id: int
    role: str
    metadata: Any


class AgentSandboxChoice:
    """Whether an agent's shell lines run in the sandbox, when its type requires one."""

    def sandboxed(self, agent_id: int) -> bool:
        return True

    def sandboxed_among(self, agents: Sequence[SandboxedAgent]) -> dict[int, bool]:
        return {agent.id: self.sandboxed(agent.id) for agent in agents}
