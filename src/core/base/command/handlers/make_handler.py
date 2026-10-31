from typing import Any

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.command.make_command import MakeCommand
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.repository.repository import Repository

CREATOR_COLUMN = "created_by"
ENVIRONMENT_COLUMN = "environment_id"


class MakeHandler(Handler[MakeCommand[Model], Model]):
    """Carries out every make command: builds the new row from the command's fields, with who made it and the
    environment it belongs to filled in, and saves it."""

    command = MakeCommand

    def __init__(self, tables: Tables, repository: Repository) -> None:
        self.tables, self.repository = tables, repository

    def handle(self, command: MakeCommand[Model], context: Context) -> Model:
        table = self.tables.table(command.model())
        values: dict[str, Any] = dict(command.model_fields())
        if table.has_column(CREATOR_COLUMN):
            values.setdefault(CREATOR_COLUMN, context.actor.id)
        if table.has_column(ENVIRONMENT_COLUMN) and context.environment_id is not None:
            values.setdefault(ENVIRONMENT_COLUMN, context.environment_id)
        return self.repository.save(table.new_model(values), context)
