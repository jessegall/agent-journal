from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.caller.caller import Caller
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_access import AliasAccess
from core.modules.aliases.nudges.alias_missing_nudge import AliasMissingNudge
from core.modules.aliases.nudges.alias_access_refused_nudge import AliasAccessRefusedNudge
from core.modules.aliases.nudges.alias_plugin_off_nudge import AliasPluginOffNudge
from core.modules.aliases.nudges.alias_unexpanded_nudge import AliasUnexpandedNudge


class AliasExpansionPolicy(EventPolicy):
    """Checks expanded alias references and permissions before the shell line runs; an alias of a plugin that
    is switched off is refused, so nothing of that plugin runs."""

    key = "aliases.expansion"
    rank = "shell.all"


    def __init__(self, aliases: AliasQuery, access: AliasAccess) -> None:
        self.aliases, self.access = aliases, access

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or not shell.alias_names:
            return None
        if shell.parse_error:
            return AliasUnexpandedNudge.declared().nudge()
        for name in shell.alias_names:
            alias = self.aliases.saved(name)
            if alias is None:
                return AliasMissingNudge.declared().nudge()
            if self.access.is_plugin_disabled(alias):
                return AliasPluginOffNudge.declared().nudge(plugin=alias.plugin_id)
            if self.access.refusal(alias, Caller(Actor(agent_id, ActorType.AGENT))):
                return AliasAccessRefusedNudge.declared().nudge()
        return None
