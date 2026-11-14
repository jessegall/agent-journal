from collections.abc import Sequence
from enum import IntEnum
from typing import ClassVar

from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.open_row import OpenRow


class StateTier(IntEnum):
    """Where an agent state's rules are asked in a hook's walk: critical first, then the stack newest first, then in
    the place the rules have today, and deferred after the reply."""

    CRITICAL = 0
    STACK = 1
    IN_PLACE = 2
    DEFERRED = 3


class AgentState:
    """A condition an agent is in, worked out from rows the journal already has, that decides which rules a hook asks
    for that agent; it stores nothing of its own."""

    name: ClassVar[str]
    tier: ClassVar[StateTier] = StateTier.STACK
    drivers: ClassVar[Sequence[str]] = ["*"]
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    rules: ClassVar[Sequence[type[DriverRule]]] = []
    deferred: ClassVar[Sequence[type]] = []
    listeners: ClassVar[Sequence[type]] = []
    substates: ClassVar[Sequence[type["AgentState"]]] = []
    exclusive: ClassVar[bool] = False
    allows_wakes: ClassVar[bool] = False
    delays_lines: ClassVar[bool] = False
    delays_notices: ClassVar[bool] = False
    pauses_agent: ClassVar[bool] = False

    def open_rows(self, hook: AgentHook) -> Sequence[OpenRow]:
        raise NotImplementedError

    def opener_key(self) -> str:
        return type(self).__qualname__
