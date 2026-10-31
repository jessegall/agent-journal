from collections.abc import Sequence
import dataclasses
from typing import TypeIs
from core.base.command.move_command import MoveCommand
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.table import Table
from core.base.registry.dotted_path import DottedPath
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.cli.make_subcommand import MakeSubcommand
from core.base.cli.show_subcommand import ShowSubcommand
from core.base.cli.list_subcommand import ListSubcommand
from core.base.cli.edit_subcommand import EditSubcommand
from core.base.cli.delete_subcommand import DeleteSubcommand
from core.base.cli.move_subcommand import MoveSubcommand
from core.base.cli.subcommand_columns import generic_base


class DefaultSubcommands:
    """Builds the subcommands every model gets from its model, so a module writes only the ones that differ."""

    def __init__(self, tables: Tables, queries: Queries) -> None:
        self.tables, self.queries = tables, queries

    def make(self, model: type[Model]) -> MakeSubcommand:
        return MakeSubcommand(self.tables.table(model))

    def show(self, model: type[Model]) -> ShowSubcommand:
        return ShowSubcommand(self.tables.table(model), self.queries)

    def list(self, model: type[Model]) -> ListSubcommand:
        return ListSubcommand(self.tables.table(model), self.queries)

    def edit(self, model: type[Model]) -> EditSubcommand:
        return EditSubcommand(self.tables.table(model))

    def delete(self, model: type[Model]) -> DeleteSubcommand:
        return DeleteSubcommand(self.tables.table(model))

    def moves(self, model: type[Model], command_paths: Sequence[str]) -> tuple[MoveSubcommand, ...]:
        lifecycle = model.lifecycle
        if lifecycle is None:
            return ()
        command_index = {command.move.name: command for command in model_move_commands(command_paths)}
        table = self.tables.table(model)
        return tuple(MoveSubcommand(table, command_index.get(move.name) or move_command(table, move)) for move in lifecycle.moves())
def move_command(table: Table[Model], move: Move) -> type[MoveCommand[Model]]:
    class_name = f"{move.name.title().replace('_', '')}{table.model.__name__}"
    return dataclasses.make_dataclass(class_name, [], bases=tuple([generic_base(MoveCommand[table.model])]), namespace={"move": move}, frozen=True)
def model_move_commands(command_paths: Sequence[str]) -> tuple[type[MoveCommand[Model]], ...]:
    loaded = tuple(DottedPath(path).loaded() for path in command_paths)
    return tuple(command for command in loaded if is_move_command(command))
def is_move_command(class_type: type) -> TypeIs[type[MoveCommand[Model]]]:
    return issubclass(class_type, MoveCommand)
