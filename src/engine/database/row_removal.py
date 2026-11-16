from collections.abc import Collection, Sequence

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.statement import Statement
from engine.errors.refusal import Refusal

REFERENCES = Statement("SELECT tables.name AS child, keys.\"from\" AS column_name, keys.\"table\" AS parent, columns.\"notnull\" AS required"
                       " FROM sqlite_master AS tables, pragma_foreign_key_list(tables.name) AS keys, pragma_table_info(tables.name) AS columns"
                       " WHERE tables.type = 'table' AND columns.name = keys.\"from\"", scan_reason=SCHEMA_REASON)


class RowRemoval:
    """Removes rows of one table and everything that depends on them, in the caller's write with the foreign
    keys off: a row that names a removed row by a required key is removed too, at every depth; a nullable key
    that names one is set to NULL; a model and id pair that names one loses its row. A row of a kept table that
    the removal would take is refused, naming the table, the column and the row; the counts per table are
    returned."""

    def __init__(self, database: Database, kept_tables: Collection[str], pairs: Sequence[tuple[str, str, str, str]] = ()) -> None:
        self.database, self.kept_tables, self.pairs = database, set(kept_tables), pairs
        self.rewrite = ReferenceRewrite(database)

    def removed(self, table: str, ids: Collection[int]) -> dict[str, int]:
        references = [dict(row) for row in self.database.rows(REFERENCES)]
        counts: dict[str, int] = {}
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
                    counts[child] = counts.get(child, 0) + self.database.update(Statement(
                        f'UPDATE "{child}" SET "{column}" = NULL WHERE "{column}" IN ({ReferenceRewrite.marks(parent_ids)})', list(parent_ids)))
                    continue
                self.refuse_kept(child, column, rows[0])
                pending.append((child, [int(row["id"]) for row in rows if "id" in row]))
            for pair_table, model_column, id_column, model in (pair for pair in self.pairs if pair[3] == parent):
                rows = [row for row in self.rewrite.rows(pair_table, id_column, parent_ids) if row[model_column] == model]
                if rows:
                    self.refuse_kept(pair_table, id_column, rows[0])
                    counts[pair_table] = counts.get(pair_table, 0) + self.rewrite.delete_past_state_rule(pair_table, [int(row["id"]) for row in rows])
            counts[parent] = counts.get(parent, 0) + self.rewrite.delete_past_state_rule(parent, parent_ids)
        return {name: count for name, count in counts.items() if count}

    def refuse_kept(self, table: str, column: str, row: dict[str, object]) -> None:
        if table in self.kept_tables:
            raise Refusal(f"removing would take {table} row {row.get('id')} by its {column}, and {table} is kept", "move or keep that row before removing")
