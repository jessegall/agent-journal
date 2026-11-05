from typing import Protocol, TypeVar, runtime_checkable

AgentRecord = TypeVar("AgentRecord", covariant=True)


@runtime_checkable
class AgentRoster(Protocol[AgentRecord]):
    """Lists the agents of a type that can hold work in an environment."""

    def available(self, environment_id: int) -> tuple[AgentRecord, ...]: ...
