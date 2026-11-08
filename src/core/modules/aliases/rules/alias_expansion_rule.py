from core.base.caller.caller import Caller
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_access import AliasAccess
from core.modules.aliases.support.alias_nudges import ALIAS_MISSING, ALIAS_ACCESS_REFUSED, ALIAS_PLUGIN_OFF, ALIAS_UNEXPANDED


class AliasExpansionRule(DriverRule):
    """Checks expanded alias references and permissions before the shell line runs; an alias of a plugin that
    is switched off is refused, so nothing of that plugin runs."""

    name = "aliases.expansion"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    overlay_proof = True

    def __init__(self, aliases: AliasQuery, access: AliasAccess) -> None:
        self.aliases, self.access = aliases, access

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not shell.alias_names:
            return RuleAnswer.allowed()
        if shell.parse_error:
            return RuleAnswer.refused(ALIAS_UNEXPANDED.nudge())
        for name in shell.alias_names:
            alias = self.aliases.saved(name)
            if alias is None:
                return RuleAnswer.refused(ALIAS_MISSING.nudge())
            if self.access.is_plugin_disabled(alias):
                return RuleAnswer.refused(ALIAS_PLUGIN_OFF.nudge(plugin=alias.plugin_id))
            if self.access.refusal(alias, Caller(Actor(hook.agent_id, ActorType.AGENT))):
                return RuleAnswer.refused(ALIAS_ACCESS_REFUSED.nudge())
        return RuleAnswer.allowed()
