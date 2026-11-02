from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.commands.close_required_command.close_required_command import CloseRequiredCommand
from core.modules.drivers.models.required_command import RequiredCommand


class CloseRequiredCommandHandler(Handler[CloseRequiredCommand, RequiredCommand]):
    """Marks a required_command settled, once."""

    command = CloseRequiredCommand

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseRequiredCommand, context: Context) -> RequiredCommand:
        required_command = self.queries.query(RequiredCommand).find(command.required_command_id)
        if required_command.closed_at is not None:
            raise Refusal(f"required_command {required_command.id} is settled already")
        return self.repository.save(replace(required_command, closed_at=context.timestamp, skip_reason=command.skip_reason), context)
