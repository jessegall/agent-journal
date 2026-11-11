from dataclasses import dataclass, replace


@dataclass(frozen=True)
class Agent:
    id: int
    ended_at: str | None = None
    pid: int | None = None

    def ended(self, timestamp: str) -> "Agent":
        # @righteous architecture_agents_agent_row_ended_outside_the_dispatcher
        return replace(self, ended_at=timestamp)


class AgentRepository:
    def update(self, agent: Agent, ended_at: str | None, pid: int | None) -> Agent:
        return agent

    def save(self, agent: Agent) -> Agent:
        return agent


class UnusedWorkerRows:
    """Ends and opens rows of workers by writing the row itself."""

    def __init__(self, repository: AgentRepository) -> None:
        self.repository = repository

    def end_unused(self, agent: Agent, timestamp: str) -> Agent:
        # @sin architecture_agents_agent_row_ended_outside_the_dispatcher
        return self.repository.update(agent, ended_at=timestamp, pid=None)

    def open_row(self, agent: Agent) -> Agent:
        # @sin architecture_agents_agent_row_ended_outside_the_dispatcher
        return self.repository.save(replace(agent, ended_at=None))

    def end_stopped(self, agent: Agent, timestamp: str) -> Agent:
        # @sin architecture_agents_agent_row_ended_outside_the_dispatcher
        return self.repository.save(agent.ended(timestamp))
