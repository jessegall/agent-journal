from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from engine.driver.loaded_actor import LoadedActor
from engine.driver.open_row import OpenRow
from engine.time.timestamp import Timestamp


@dataclass(frozen=True)
class AgentHook:
    """A hook event with its agent, the agent's driver, the time it was taken, the layer it is asked for,
    and the row the agent's default states stand on with the defaults it carries and the state that takes each away while open."""

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
    anchor: OpenRow | None = None
    defaults: Sequence[str] = ()
    removed_while: Mapping[str, str] = field(default_factory=dict[str, str])
    # the old rules that stand down at this hook, since the new driver answers their slices for the agent
    machine_answered_rules: frozenset[str] = frozenset()

    @classmethod
    def of_actor(cls, event: HookEvent, actor: LoadedActor, timestamp: Timestamp) -> "AgentHook":
        return cls(event, actor.agent_id, actor.environment_id, actor.role, actor.driver, timestamp, suite=actor.suite, access=actor.access, anchor=actor.anchor,
                   defaults=tuple(actor.defaults), removed_while=actor.removed_while)

    @property
    def hook_name(self) -> str:
        return self.event.event

    @property
    def layer_ref(self) -> str:
        return self.layer.ref if self.layer is not None else ""

    @property
    def is_main_stop(self) -> bool:
        return self.hook_name == HookEventName.STOP and self.role == AgentRole.MAIN
