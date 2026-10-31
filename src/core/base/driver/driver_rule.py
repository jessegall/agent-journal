from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.rule_answer import RuleAnswer


class DriverRule:
    """The base of every driver rule: one rule about what an agent may do or is told, asked on the hooks its pattern
    covers while a driver its patterns name drives the agent; its class docstring says the rule in plain words."""

    name: ClassVar[str]
    hook: ClassVar[str]
    drivers: ClassVar[Sequence[str]] = []
    roles: ClassVar[Sequence[str]] = []
    essential: ClassVar[bool] = False
    history: ClassVar[bool] = False

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise NotImplementedError
