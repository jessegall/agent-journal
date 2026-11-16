from engine.helper_type.helper_type_book import HelperTypeBook
from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.aliases.models.alias import Alias
from core.modules.plugins.models.plugin import Plugin


class AliasAccess:
    """Checks alias permissions for the roles a suite restricts, a saved test or build being open to every
    role, and refuses everyone an alias whose plugin is switched off."""

    def __init__(self, queries: Queries, types: HelperTypeBook) -> None:
        self.queries, self.types = queries, types

    def check(self, alias: Alias, caller: Caller) -> None:
        if refusal := self.refusal(alias, caller):
            raise refusal

    def is_plugin_disabled(self, alias: Alias) -> bool:
        return alias.plugin_id is not None and not self.queries.query(Plugin).find(alias.plugin_id).enabled

    def refusal(self, alias: Alias, caller: Caller) -> Refusal | None:
        if self.is_plugin_disabled(alias):
            return Refusal(f"{alias.name} belongs to a plugin that is switched off", "a user switches the plugin on in its window")
        if alias.agent_access or caller.actor.type is not ActorType.AGENT or (alias.category and alias.category.is_long_running):
            return None
        agent = self.queries.query(Agent).find(caller.actor.agent_id())
        if self.types.behaviours(agent.role).has_restricted_aliases:
            return Refusal(f"a {agent.role} runs only the aliases marked for agents, and {alias.name} is not", f"ask the main agent to mark it: journal alias edit {alias.name} --agents")
        return None
