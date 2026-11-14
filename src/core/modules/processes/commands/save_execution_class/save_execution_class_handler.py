from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.save_execution_class.save_execution_class import SaveExecutionClass
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses


class SaveExecutionClassHandler(Handler[SaveExecutionClass, str]):
    """Keeps a class after checking its cost fits its lane; a class of the same name is changed in place."""

    command = SaveExecutionClass

    def __init__(self, queries: Queries, repository: Repository, store: StoredExecutionClasses) -> None:
        self.queries, self.repository, self.store = queries, repository, store

    def handle(self, command: SaveExecutionClass, context: Context) -> str:
        chosen = self.store.validated(command.execution_class)
        stored = self.queries.query(ExecutionClassRow).filter(name=chosen.name).first()
        row = ExecutionClassRow(name=chosen.name, lane=chosen.lane, slot_cost=chosen.slot_cost, priority=chosen.priority, class_limit=chosen.class_limit,
                                line_pattern=chosen.line_pattern, plugin=chosen.plugin, is_override=command.is_override)
        if stored is None:
            self.repository.save(row, context)
        else:
            self.repository.update(stored, context, lane=row.lane, slot_cost=row.slot_cost, priority=row.priority, class_limit=row.class_limit,
                                   line_pattern=row.line_pattern, plugin=row.plugin, is_override=row.is_override)
        return f"class {chosen.name}: {chosen.lane} lane, cost {chosen.slot_cost}, {chosen.priority.name.lower()}"
