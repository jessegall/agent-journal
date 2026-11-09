import json
from collections.abc import Sequence

from core.base.database.database import Database
from core.base.database.registry_table import RegistryTable
from core.base.database.table_statements import TableStatements
from core.base.model.added_state import AddedState
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.registry.state_addition_entry import StateAdditionEntry


class StateRetirement:
    """Moves the rows of a state no installed module registers any more to the state its module named,
    comparing the registry saved by the last sync with the modules installed now, so a module that was
    deleted is handled like one that was removed."""

    def __init__(self, database: Database, tables: Tables, registry_table: RegistryTable) -> None:
        self.database, self.tables, self.registry_table = database, tables, registry_table

    def saved_additions(self) -> tuple[StateAdditionEntry, ...]:
        row = self.registry_table.row()
        if row is None:
            return ()
        entries = json.loads(row["entries"])
        return tuple(StateAdditionEntry.restored(stored) for stored in entries.get("state_additions", []))

    def retire(self, models: Sequence[type[Model]], book: StateBook, timestamp: str) -> list[str]:
        model_index = {model.model_name: model for model in models}
        notes: list[str] = []
        for entry in self.saved_additions():
            model = model_index.get(entry.model_name)
            lifecycle = book.lifecycle(model) if model is not None else None
            if model is None or lifecycle is None or lifecycle.has_state(AddedState(entry.state)):
                continue
            moved = self.database.update(TableStatements(self.tables.table(model)).state_retirement(entry.state, entry.fallback_state, timestamp))
            if moved:
                notes.append(f"{moved} {model.cli_name} rows left the state {entry.state} and are {entry.fallback_state}")
        return notes
