from collections.abc import Collection, Mapping, Sequence

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.removal_counts import RemovalCounts
from engine.database.statement import Statement
from engine.errors.refusal import Refusal

REFERENCES = Statement("SELECT tables.name AS child, keys.\"from\" AS column_name, keys.\"table\" AS parent, columns.\"notnull\" AS required"
                       " FROM sqlite_master AS tables, pragma_foreign_key_list(tables.name) AS keys, pragma_table_info(tables.name) AS columns"
                       " WHERE tables.type = 'table' AND columns.name = keys.\"from\"", scan_reason=SCHEMA_REASON)


class RowRemoval:
    """Removes rows of one table and everything that depends on them, in the caller's write with the foreign
    keys off: a row that names a removed row by a required key is removed too, at every depth; a nullable key
    that names one is set to NULL; a model and id pair whose model is one of the removed table's model names loses its row. A row of a kept table that
    the removal would take is refused, naming the table, the column and the row; the counts per table are
    returned, the deleted apart from the nulled. A table with no id column loses its rows by the key itself."""

    def __init__(self, database: Database, kept_tables: Collection[str], pairs: Sequence[tuple[str, str, str]] = (),
                 pair_models: Mapping[str, tuple[str, ...]] | None = None) -> None:
        self.database, self.kept_tables, self.pairs, self.pair_models = database, set(kept_tables), pairs, pair_models or {}
        self.rewrite = ReferenceRewrite(database)

    def removed(self, table: str, ids: Collection[int]) -> RemovalCounts:
        references = [dict(row) for row in self.database.rows(REFERENCES)]
        counts = RemovalCounts()
        pending = [(table, sorted(set(ids)))]
        while pending:
            parent, parent_ids = pending.pop()
            if not parent_ids:
                continue
            for reference in (reference for reference in references if reference["parent"] == parent):
                child, column = str(reference["child"]), str(reference["column_name"])
                rows = self.rewrite.rows(child, column, parent_ids)
                if not rows:
                    continue
                if not reference["required"]:
                    counts.add_nulled(child, self.database.update(Statement(
                        f'UPDATE "{child}" SET "{column}" = NULL WHERE "{column}" IN ({ReferenceRewrite.marks(parent_ids)})', list(parent_ids))))
                    continue
                self.refuse_kept(child, column, rows[0])
                if "id" not in rows[0]:
                    counts.add_deleted(child, self.database.update(Statement(
                        f'DELETE FROM "{child}" WHERE "{column}" IN ({ReferenceRewrite.marks(parent_ids)})', list(parent_ids))))
                    continue
                pending.append((child, [int(row["id"]) for row in rows]))
            for pair_table, model_column, id_column in (self.pairs if parent in self.pair_models else ()):
                rows = [row for row in self.rewrite.rows(pair_table, id_column, parent_ids) if row[model_column] in self.pair_models[parent]]
                if rows:
                    self.refuse_kept(pair_table, id_column, rows[0])
                    counts.add_deleted(pair_table, self.rewrite.delete_past_state_rule(pair_table, [int(row["id"]) for row in rows]))
            counts.add_deleted(parent, self.rewrite.delete_past_state_rule(parent, parent_ids))
        return counts

    def refuse_kept(self, table: str, column: str, row: dict[str, object]) -> None:
        if table in self.kept_tables:
            raise Refusal(f"removing would take {table} row {row.get('id')} by its {column}, and {table} is kept", "move or keep that row before removing")
