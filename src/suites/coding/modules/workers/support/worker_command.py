from core.modules.agents.models.agent import Agent

CLAUDE = "claude"


class WorkerCommand:
    """The command line that starts a worker's program under the session its agent row names."""

    def arguments(self, worker: Agent) -> tuple[str, ...]:
        if worker.program == CLAUDE:
            return (CLAUDE, "--session-id", worker.session)
        return tuple([worker.program])
