from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.bind_subagent_dispatch.bind_subagent_dispatch import BindSubagentDispatch
from core.modules.drivers.models.subagent_dispatch import SubagentDispatch


class BindSubagentDispatchHandler(Handler[BindSubagentDispatch, SubagentDispatch | None]):
    """Ties a started subagent to its dispatch; a subagent with no dispatch of its profile stays without one."""

    command = BindSubagentDispatch

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: BindSubagentDispatch, context: Context) -> SubagentDispatch | None:
        rows = self.queries.query(SubagentDispatch).filter(agent_id=command.parent_id, profile=command.profile).matching(IsNull("subagent_id")).oldest().page(1, 1).rows
        return self.repository.save(replace(rows[0], subagent_id=command.subagent_id), context) if rows else None
