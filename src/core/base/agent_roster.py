from typing import Protocol, TYPE_CHECKING, runtime_checkable

if TYPE_CHECKING:
    from core.modules.agents.models.agent import Agent


@runtime_checkable
class AgentRoster(Protocol):
    """Lists the agents of a type that can hold work in an environment."""

    def available(self, environment_id: int) -> tuple["Agent", ...]: ...
