from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.commands.record_subagent_dispatch.record_subagent_dispatch import RecordSubagentDispatch
from core.modules.drivers.models.helper_job import HelperJob

DETAIL_CHARACTERS = 4000


class RecordSubagentDispatchHandler(Handler[RecordSubagentDispatch, HelperJob]):
    """Saves a dispatch once under its key, and what it returned when it ends."""

    command = RecordSubagentDispatch

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordSubagentDispatch, context: Context) -> HelperJob:
        rows = self.queries.query(HelperJob).filter(agent_id=command.agent_id, tool_key=command.tool_key).limited(1)
        if rows and command.is_ended:
            return self.repository.save(replace(rows[0], returned=command.returned[:DETAIL_CHARACTERS], ended_at=context.timestamp), context)
        if rows:
            return rows[0]
        return self.repository.save(HelperJob(agent_id=command.agent_id, creator_id=context.actor.id, tool_key=command.tool_key,
                                                     profile=command.profile, program_model=command.program_model, description=command.description, brief=command.instruction, instruction=command.instruction[:DETAIL_CHARACTERS]), context)
