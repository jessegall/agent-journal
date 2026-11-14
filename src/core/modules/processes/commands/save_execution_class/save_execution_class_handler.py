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
        selected = self.store.validated(command.execution_class)
        stored = self.queries.query(ExecutionClassRow).filter(name=selected.name).first()
        row = ExecutionClassRow(name=selected.name, lane=selected.lane, slot_cost=selected.slot_cost, priority=selected.priority, class_limit=selected.class_limit,
                                line_pattern=selected.line_pattern, plugin=selected.plugin, is_override=command.is_override)
        if stored is None:
            self.repository.save(row, context)
        else:
            self.repository.update(stored, context, lane=row.lane, slot_cost=row.slot_cost, priority=row.priority, class_limit=row.class_limit,
                                   line_pattern=row.line_pattern, plugin=row.plugin, is_override=row.is_override)
        return f"class {selected.name}: {selected.lane} lane, cost {selected.slot_cost}, {selected.priority.name.lower()}"
