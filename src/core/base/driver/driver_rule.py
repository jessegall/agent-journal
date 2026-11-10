from collections.abc import Sequence
from typing import ClassVar

from core.base.driver.agent_hook import AgentHook
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType
from core.base.role_group import RoleGroup
from core.base.scope.scopes import WholeScopes


class DriverRule:
    """The base of every driver rule: one rule about what an agent may do or reads, asked on the hooks it
    covers while a driver its patterns name drives the agent; its class docstring says the rule in plain
    words; a rule that refuses one action outright says why in refuses_one_action, since every other hold is a BlockUntil."""

    name: ClassVar[str]
    hook: ClassVar[HookEventName | HookWildcard]
    drivers: ClassVar[Sequence[str]] = []
    roles: ClassVar[Sequence[str]] = []
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    priority: ClassVar[int] = 0
    essential: ClassVar[bool] = False
    exempt: ClassVar[bool] = False
    history: ClassVar[bool] = False
    overlay_proof: ClassVar[bool] = False
    yields_to_pause: ClassVar[bool] = False
    wakes_agent: ClassVar[bool] = False
    is_notice: ClassVar[bool] = False
    start_line_rule: ClassVar[bool] = False
    refuses_one_action: ClassVar[str] = ""
    disabled_scopes: ClassVar[WholeScopes] = ()
    tools: ClassVar[Sequence[ToolType]] = ()

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise NotImplementedError
