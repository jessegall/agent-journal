from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from engine.driver.loaded_actor import LoadedActor
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class AgentHook:
    """A hook event with its agent, the agent's suite and driver and the time it was taken."""

    event: HookEvent
    agent_id: int
    environment_id: int
    role: str
    driver: str
    timestamp: Timestamp
    suite: str = ""
    access: str = ""

    @classmethod
    def actor_hook(cls, event: HookEvent, actor: LoadedActor, timestamp: Timestamp) -> "AgentHook":
        return cls(event, actor.agent_id, actor.environment_id, actor.role, actor.driver, timestamp, suite=actor.suite, access=actor.access)

    @property
    def hook_name(self) -> str:
        return self.event.event

    @property
    def is_main_stop(self) -> bool:
        return self.hook_name == HookEventName.STOP and self.role == AgentRole.MAIN
