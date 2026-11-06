from typing import Protocol, TypeVar, runtime_checkable

from core.base.command.context import Context

AgentRecord = TypeVar("AgentRecord")


@runtime_checkable
class AgentRoster(Protocol[AgentRecord]):
    """Lists the agents of a type that can hold work in an environment, and says what holds one from retiring."""

    def available(self, environment_id: int) -> tuple[AgentRecord, ...]: ...

    def retire_block(self, agent: AgentRecord) -> str: ...

    def settle(self, agent: AgentRecord, context: Context) -> None: ...
