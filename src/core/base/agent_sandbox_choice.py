class AgentSandboxChoice:
    """Whether an agent's shell lines run in the sandbox, when its type requires one."""

    def sandboxed(self, agent_id: int) -> bool:
        return True
