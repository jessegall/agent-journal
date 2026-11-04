from core.base.actor_type import ActorType
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.aliases.models.alias import Alias


class AliasAccess:
    """Checks alias permissions for the roles a suite restricts."""

    def __init__(self, queries: Queries, suites: SuiteChoice) -> None:
        self.queries, self.suites = queries, suites

    def check(self, alias: Alias, caller: Caller) -> None:
        if refusal := self.refusal(alias, caller):
            raise refusal

    def refusal(self, alias: Alias, caller: Caller) -> Refusal | None:
        if alias.agent_access or caller.actor.type is not ActorType.AGENT:
            return None
        agent = self.queries.query(Agent).find(caller.actor.id)
        if agent.role in self.suites.agent_policy(agent.environment_id).restricted_alias_roles:
            return Refusal(f"a {agent.role} runs only the aliases marked for agents, and {alias.name} is not", f"ask the main agent to mark it: journal alias edit {alias.name} --agents")
        return None
