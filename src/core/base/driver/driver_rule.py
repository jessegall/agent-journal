from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.agent_role import AgentRole


class DriverRule:
    """The base of every driver rule: one rule about what an agent may do or reads, asked on the hooks it covers
    while a driver its patterns name drives the agent; its class docstring says the rule in plain words."""

    name: ClassVar[str]
    hook: ClassVar[HookEventName | HookWildcard]
    drivers: ClassVar[Sequence[str]] = []
    roles: ClassVar[Sequence[AgentRole]] = []
    essential: ClassVar[bool] = False
    history: ClassVar[bool] = False

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise NotImplementedError
