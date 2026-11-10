from dataclasses import dataclass

from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from core.base.driver.open_row import OpenRow
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class AgentHook:
    """A hook event with its agent, the agent's driver, the time it was taken, and the layer it is asked for.
    """

    event: HookEvent
    agent_id: int
    environment_id: int
    role: str
    driver: str
    timestamp: Timestamp
    layer: OpenRow | None = None
    suite: str = ""
    control_return: bool = False
    access: str = ""

    @property
    def hook_name(self) -> str:
        return self.event.event

    @property
    def layer_ref(self) -> str:
        return self.layer.ref if self.layer is not None else ""

    @property
    def is_main_stop(self) -> bool:
        return self.hook_name == HookEventName.STOP and self.role == AgentRole.MAIN
