from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.caller.caller import Caller
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.support.alias_access import AliasAccess
from core.modules.aliases.agent_messages.alias_missing_message import AliasMissingMessage
from core.modules.aliases.agent_messages.alias_access_refusal_message import AliasAccessRefusalMessage
from core.modules.aliases.agent_messages.alias_plugin_off_message import AliasPluginOffMessage
from core.modules.aliases.agent_messages.alias_unexpanded_message import AliasUnexpandedMessage


class AliasExpansionPolicy(EventPolicy):
    """Checks expanded alias references and permissions before the shell line runs; an alias of a plugin that
    is switched off is refused, so nothing of that plugin runs."""

    key = "aliases.expansion"
    rank = "shell.all"


    def __init__(self, aliases: AliasQuery, access: AliasAccess) -> None:
        self.aliases, self.access = aliases, access

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or not shell.alias_names:
            return None
        if shell.parse_error:
            return AliasUnexpandedMessage.declared().agent_message()
        for name in shell.alias_names:
            alias = self.aliases.saved(name)
            if alias is None:
                return AliasMissingMessage.declared().agent_message()
            if self.access.is_plugin_disabled(alias):
                return AliasPluginOffMessage.declared().agent_message(plugin=alias.plugin_id)
            if self.access.refusal(alias, Caller(Actor(agent_id, ActorType.AGENT))):
                return AliasAccessRefusalMessage.declared().agent_message()
        return None
