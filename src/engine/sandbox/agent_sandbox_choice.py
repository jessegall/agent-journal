from collections.abc import Sequence
from engine.sandbox.sandboxed_agent import SandboxedAgent


class AgentSandboxChoice:
    """Whether an agent's shell lines run in the sandbox, when its type requires one."""

    def sandboxed(self, agent_id: int) -> bool:
        return True

    def sandboxed_among(self, agents: Sequence[SandboxedAgent]) -> dict[int, bool]:
        return {agent.id: self.sandboxed(agent.id) for agent in agents}
