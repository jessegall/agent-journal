from dataclasses import replace

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.commands.grant_helper.grant_helper import GrantHelper
from core.modules.helpers.models.helper_grant import HelperGrant


class GrantHelperHandler(Handler[GrantHelper, HelperGrant]):
    """Says what one helper may run; only a person or a main agent may."""

    command = GrantHelper

    def __init__(self, agents: AgentRows, queries: Queries, repository: Repository) -> None:
        self.agents, self.queries, self.repository = agents, queries, repository

    def handle(self, command: GrantHelper, context: Context) -> HelperGrant:
        if context.actor.type is ActorType.AGENT and self.agents.find(context.actor.id).parent_id is not None:
            raise Refusal("only a person or the main agent grants what a helper may run", "ask the main agent")
        helper = self.agents.find(command.helper_id)
        grant = self.queries.query(HelperGrant).filter(helper_id=helper.id, program=command.program).first()
        if grant is None:
            return self.repository.save(HelperGrant(helper_id=helper.id, program=command.program, subcommands=command.subcommands, arguments=command.arguments), context)
        return self.repository.save_change(grant, replace(grant, subcommands=command.subcommands, arguments=command.arguments), context)
