from dataclasses import dataclass, replace


@dataclass(frozen=True)
class Agent:
    id: int
    given_name: str = ""
    ended_at: str | None = None


@dataclass(frozen=True)
class HelperJob:
    id: int
    ended_at: str | None = None


class AgentDispatcher:
    def end_row(self, agent: Agent, timestamp: str) -> Agent:
        # @righteous architecture_agents_agent_row_ended_outside_the_dispatcher
        return replace(agent, ended_at=timestamp)


class UnusedWorkerEnds:
    """Ends rows of workers through the dispatcher, and ends a job, which is no agent row, itself."""

    def __init__(self, dispatcher: AgentDispatcher) -> None:
        self.dispatcher = dispatcher

    def end_unused(self, agent: Agent, timestamp: str) -> Agent:
        # @righteous architecture_agents_agent_row_ended_outside_the_dispatcher
        return self.dispatcher.end_row(agent, timestamp)

    def end_job(self, job: HelperJob, timestamp: str) -> HelperJob:
        # @righteous architecture_agents_agent_row_ended_outside_the_dispatcher
        return replace(job, ended_at=timestamp)

    def rename(self, agent: Agent) -> Agent:
        # @righteous architecture_agents_agent_row_ended_outside_the_dispatcher
        return replace(agent, given_name="Ada")
