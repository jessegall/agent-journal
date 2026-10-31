from enum import StrEnum

from core.base.database.constraint_refusals import RULE_PREFIX
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.model.model import STATE, Model
from core.base.model.table import indefinite_article
from core.base.model.tables import Tables

RULE_TRIGGERS = Statement("SELECT name FROM sqlite_master WHERE type = 'trigger' AND name LIKE '%\\_rule\\_%' ESCAPE '\\'")


def listed(values: tuple[str, ...]) -> str:
    return ", ".join(f"'{value}'" for value in values)


class Triggers:
    """Creates the database triggers that enforce each model's lifecycle and allowed values."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.database, self.tables = database, tables

    def rebuild(self, models: tuple[type[Model], ...]) -> None:
        with self.database.transaction():
            for row in self.database.rows(RULE_TRIGGERS):
                self.database.update(Statement(f"DROP TRIGGER {row['name']}"))
            for model in models:
                for sql in self.lifecycle_triggers(model) + self.enum_triggers(model):
                    self.database.update(Statement(sql))

    def lifecycle_triggers(self, model: type[Model]) -> tuple[str, ...]:
        lifecycle = model.lifecycle
        if lifecycle is None:
            return ()
        table, noun = self.tables.table(model).name, model.cli_noun
        pairs = listed(tuple(f"{source.value}>{move.target.value}" for move in lifecycle.moves() for source in move.sources))
        return (
            f"CREATE TRIGGER {table}_rule_state_insert BEFORE INSERT ON {table} WHEN NEW.{STATE} NOT IN ({listed(tuple(lifecycle.initial))})"
            f" BEGIN SELECT RAISE(ABORT, '{RULE_PREFIX}a new {noun} starts as {' or '.join(lifecycle.initial)}'); END",
            f"CREATE TRIGGER {table}_rule_state_move BEFORE UPDATE OF {STATE} ON {table}"
            f" WHEN OLD.{STATE} != NEW.{STATE} AND OLD.{STATE} || '>' || NEW.{STATE} NOT IN ({pairs})"
            f" BEGIN SELECT RAISE(ABORT, '{RULE_PREFIX}no move of {indefinite_article(noun)} {noun} leads from that state to that state'); END",
            f"CREATE TRIGGER {table}_rule_state_delete BEFORE DELETE ON {table} WHEN OLD.{STATE} NOT IN ({listed(tuple(lifecycle.deletable))})"
            f" BEGIN SELECT RAISE(ABORT, '{RULE_PREFIX}{indefinite_article(noun)} {noun} in that state cannot be deleted'); END",
        )

    def enum_triggers(self, model: type[Model]) -> tuple[str, ...]:
        table = self.tables.table(model)
        enums = {column: kind for column, kind in table.types.items() if issubclass(kind, StrEnum) and column != STATE}
        triggers: list[str] = []
        for column, kind in enums.items():
            allowed = listed(tuple(member.value for member in kind))
            refusal = f"SELECT RAISE(ABORT, '{RULE_PREFIX}{indefinite_article(model.cli_noun)} {model.cli_noun}''s {column} is one of {', '.join(member.value for member in kind)}')"
            triggers.append(f"CREATE TRIGGER {table.name}_rule_{column}_insert BEFORE INSERT ON {table.name} WHEN NEW.{column} NOT IN ({allowed}) BEGIN {refusal}; END")
            triggers.append(f"CREATE TRIGGER {table.name}_rule_{column}_update BEFORE UPDATE OF {column} ON {table.name} WHEN NEW.{column} NOT IN ({allowed}) BEGIN {refusal}; END")
        return tuple(triggers)
