from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.commands.grant_helper.grant_helper import GrantHelper
from core.modules.drivers.support.nudger import Nudger
from core.modules.helpers.models.helper_grant import HelperGrant
from core.modules.helpers.support.helper_grant_policy import HelperGrantPolicy
from core.modules.helpers.support.helper_job_source import HELPER_JOB_SOURCE
from core.modules.helpers.support.helper_nudges import HELPER_GRANTED


class GrantHelperHandler(Handler[GrantHelper, HelperGrant]):
    """Says what one helper may run and tells that helper."""

    command = GrantHelper

    def __init__(self, agents: AgentRows, queries: Queries, repository: Repository, policy: HelperGrantPolicy, nudger: Nudger) -> None:
        self.agents, self.queries, self.repository, self.policy, self.nudger = agents, queries, repository, policy, nudger

    def handle(self, command: GrantHelper, context: Context) -> HelperGrant:
        self.policy.check(command.alternatives(), context)
        helper = self.agents.find(command.helper_id)
        grant = self.queries.query(HelperGrant).filter(helper_id=helper.id, program=command.program).first()
        saved = self.repository.save(HelperGrant(helper_id=helper.id, program=command.program, subcommands=command.subcommands, arguments=command.arguments), context) if grant is None else self.repository.save_change(grant, replace(grant, subcommands=command.subcommands, arguments=command.arguments), context)
        self.nudger.send(helper.id, HELPER_GRANTED, HELPER_JOB_SOURCE, context, grant=saved.id)
        return saved
