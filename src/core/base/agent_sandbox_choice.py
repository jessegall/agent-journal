from collections.abc import Sequence


class AgentSandboxChoice:
    """Whether an agent's shell lines run in the sandbox, when its type requires one."""

    def sandboxed(self, agent_id: int) -> bool:
        return True

    def sandboxed_among(self, agent_ids: Sequence[int]) -> dict[int, bool]:
        return {agent_id: self.sandboxed(agent_id) for agent_id in agent_ids}
