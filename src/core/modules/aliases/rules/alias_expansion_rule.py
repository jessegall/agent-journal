from engine.caller.caller import Caller
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_access import AliasAccess
from core.modules.aliases.nudges.alias_missing_nudge import AliasMissingNudge
from core.modules.aliases.nudges.alias_access_refused_nudge import AliasAccessRefusedNudge
from core.modules.aliases.nudges.alias_plugin_off_nudge import AliasPluginOffNudge
from core.modules.aliases.nudges.alias_unexpanded_nudge import AliasUnexpandedNudge


class AliasExpansionRule(DriverRule):
    """Checks expanded alias references and permissions before the shell line runs; an alias of a plugin that
    is switched off is refused, so nothing of that plugin runs."""

    name = "aliases.expansion"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    essential = True
    overlay_proof = True
    single_action_refusal = "Checks expanded alias references and permissions before the shell line runs"

    def __init__(self, aliases: AliasQuery, access: AliasAccess) -> None:
        self.aliases, self.access = aliases, access

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or not shell.alias_names:
            return RuleAnswer.allowed()
        if shell.parse_error:
            return RuleAnswer.refused(AliasUnexpandedNudge.declared().nudge())
        for name in shell.alias_names:
            alias = self.aliases.saved(name)
            if alias is None:
                return RuleAnswer.refused(AliasMissingNudge.declared().nudge())
            if self.access.is_plugin_disabled(alias):
                return RuleAnswer.refused(AliasPluginOffNudge.declared().nudge(plugin=alias.plugin_id))
            if self.access.refusal(alias, Caller(Actor(hook.agent_id, ActorType.AGENT))):
                return RuleAnswer.refused(AliasAccessRefusedNudge.declared().nudge())
        return RuleAnswer.allowed()
