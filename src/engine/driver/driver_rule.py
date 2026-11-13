from collections.abc import Sequence
from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.enums.hook_wildcard import HookWildcard
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.enums.tool_type import ToolType
from engine.agent.enums.role_group import RoleGroup
from engine.scope.scopes import WholeScopes


class DriverRule:
    """The base of every driver rule: one rule about what an agent may do or reads, asked on the hooks it
    covers while a driver its patterns name drives the agent; its class docstring says the rule in plain
    words; a rule that refuses one action outright says why in single_action_refusal, since every other hold
    is a BlockUntil."""

    name: ClassVar[str]
    hook: ClassVar[HookEventName | HookWildcard]
    drivers: ClassVar[Sequence[str]] = []
    roles: ClassVar[Sequence[str]] = []
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    priority: ClassVar[RulePriority] = RulePriority.NORMAL
    essential: ClassVar[bool] = False
    exempt: ClassVar[bool] = False
    history: ClassVar[bool] = False
    overlay_proof: ClassVar[bool] = False
    is_pause_skipped: ClassVar[bool] = False
    wakes_agent: ClassVar[bool] = False
    is_notice: ClassVar[bool] = False
    start_line_rule: ClassVar[bool] = False
    single_action_refusal: ClassVar[str] = ""
    disabled_scopes: ClassVar[WholeScopes] = ()
    tools: ClassVar[Sequence[ToolType]] = ()

    def answer(self, hook: AgentHook) -> RuleAnswer:
        raise NotImplementedError
