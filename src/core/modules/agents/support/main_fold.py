import json

from engine.database.database import Database
from engine.database.reference_rewrite import ReferenceRewrite
from engine.database.row_insert import RowInsert
from engine.database.schema_columns import SchemaColumns
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import MAIN_NUMBER
from core.modules.agents.support.fold_clash_rules import FoldClashRules
from core.modules.agents.support.main_fold_plan import MainFoldPlan
from core.modules.agents.support.environment_fold import EnvironmentFold
from core.modules.agents.support.main_row import MainRow
from core.modules.agents.support.reference_columns import AGENT_MODEL_NAMES, ReferenceColumns
from core.modules.agents.support.agent_columns import AgentColumns
from core.modules.agents.models.agent import AGENTS_TABLE
from core.modules.agents.support.reference_columns import FOLD_TABLES
from engine.database.row_insert import RowInsert
from engine.database.unique_key import UniqueKey
from core.modules.agents.support.fold_counts import FoldCounts
from core.modules.agents.support.fold_counts import ACTORS_TABLE

SESSIONS = ("agent_sessions", "session_agent_id")


class MainFold:
    """Folds the older main agent rows of each environment into its one main agent in one transaction with
    foreign keys off: settles the rows that would clash, moves the sessions first, points every column and model
    pair that holds a folded agent at the survivor, records each folded agent whole, removes the folded rows and
    gives the survivor number 1, then compares the counts and the keys and rolls everything back on a mismatch."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.rewrite = ReferenceRewrite(database)
        self.inserts = RowInsert(database)

    def plan(self) -> tuple[EnvironmentFold, ...]:
        return MainFoldPlan.folds([MainRow.from_row(row) for row in self.rewrite.rows_where(AGENTS_TABLE, "role", AgentRole.MAIN.value)])

    def run(self, folds: tuple[EnvironmentFold, ...], folded_at: str) -> FoldCounts:
        counts = FoldCounts()
        if not folds:
            return counts
        schema = SchemaColumns(self.database).columns()
        columns = ReferenceColumns.agent_columns(schema)
        tables = sorted({column.table for column in schema})
        with self.rewrite.without_foreign_keys():
            with self.database.transaction():
                counts.tables_prior = self.rewrite.table_counts(tables)
                for fold in folds:
                    self.fold(fold, columns, counts, folded_at)
                counts.tables_after = self.rewrite.table_counts(tables)
                self.check(counts, sum(len(fold.folded) for fold in folds))
        return counts

    def check(self, counts: FoldCounts, folded_count: int) -> None:
        problems = counts.mismatches(folded_count) + self.rewrite.broken_keys()
        if not self.rewrite.is_intact():
            problems.append("the integrity check failed")
        if problems:
            raise Refusal(f"the fold of main agents does not add up, so nothing changed: {'; '.join(problems[:10])}")

    def fold(self, fold: EnvironmentFold, columns: AgentColumns, counts: FoldCounts, folded_at: str) -> None:
        folded_ids = [agent.id for agent in fold.folded]
        before = self.reference_counts(columns, [*folded_ids, fold.survivor.id])
        fold_ids = [self.record(fold, agent, folded_at) for agent in fold.folded]
        self.settle_clashes(fold, columns, counts, fold_ids[0], folded_at)
        self.rewrite.rewrite(*SESSIONS, folded_ids, fold.survivor.id)
        for table, column in columns.plain:
            self.rewrite.rewrite(table, column, folded_ids, fold.survivor.id)
        for table, model_column, id_column in columns.pairs:
            self.rewrite.pair_rewrite(table, model_column, id_column, AGENT_MODEL_NAMES, folded_ids, fold.survivor.id)
        for name, after in self.reference_counts(columns, [fold.survivor.id]).items():
            counts.add_reference(name, before[name], after)
        self.rewrite.delete(AGENTS_TABLE, folded_ids)
        self.rewrite.delete(ACTORS_TABLE, folded_ids)
        RowInsert(self.database).set_value(AGENTS_TABLE, fold.survivor.id, "number", MAIN_NUMBER)

    def reference_counts(self, columns: AgentColumns, ids: list[int]) -> dict[str, int]:
        plain = {f"{table}.{column}": self.rewrite.count(table, column, ids) for table, column in columns.plain}
        pairs = {f"{table}.{model_column}/{id_column}": self.rewrite.pair_count(table, model_column, id_column, AGENT_MODEL_NAMES, ids)
                 for table, model_column, id_column in columns.pairs}
        return plain | pairs

    def record(self, fold: EnvironmentFold, agent: MainRow, folded_at: str) -> int:
        agent_rows = self.rewrite.rows(AGENTS_TABLE, "id", [agent.id])
        actor_rows = self.rewrite.rows(ACTORS_TABLE, "id", [agent.id])
        sessions = self.rewrite.rows(*SESSIONS, [agent.id])
        return self.inserts.insert(FOLD_TABLES[0], {"environment_id": fold.environment_id, "folded_agent_id": agent.id, "survivor_id": fold.survivor.id,
                                                    "folded_number": agent.number, "agent_row": json.dumps(agent_rows[0], default=str),
                                                    "actor_row": json.dumps(actor_rows[0] if actor_rows else {}, default=str),
                                                    "sessions": json.dumps(sessions, default=str), "folded_at": folded_at,
                                                    "created_at": folded_at, "updated_at": folded_at})

    def settle_clashes(self, fold: EnvironmentFold, columns: AgentColumns, counts: FoldCounts, fold_id: int, folded_at: str) -> None:
        for unique in self.rewrite.unique_keys():
            table = unique.table
            if table in FOLD_TABLES:
                continue
            for column, model_column in MainFold.agent_parts(columns, table, unique.columns):
                for group in self.clashing_groups(fold, unique, column, model_column):
                    settled = FoldClashRules.settled(table, group, fold.survivor.id, column)
                    for removed in settled.removed:
                        self.inserts.insert(FOLD_TABLES[1], {"environment_id": fold.environment_id, "fold_id": fold_id, "table_name": table,
                                                             "row": json.dumps(removed, default=str), "rule": settled.rule,
                                                             "created_at": folded_at, "updated_at": folded_at})
                        counts.add_removed(table, MainFold.references_held(columns, table, removed, fold), settled.rule)
                    self.rewrite.delete_past_state_rule(table, [int(row["id"]) for row in settled.removed])

    @staticmethod
    def agent_parts(columns: AgentColumns, table: str, key: tuple[str, ...]) -> list[tuple[str, str | None]]:
        plain = [(column, None) for owner, column in columns.plain if owner == table and column in key]
        pairs = [(id_column, model_column) for owner, model_column, id_column in columns.pairs if owner == table and model_column in key and id_column in key]
        return plain + pairs

    @staticmethod
    def references_held(columns: AgentColumns, table: str, row: dict[str, object], fold: EnvironmentFold) -> list[str]:
        ids = {fold.survivor.id, *(agent.id for agent in fold.folded)}
        plain = [f"{table}.{column}" for owner, column in columns.plain if owner == table and row[column] in ids]
        pairs = [f"{table}.{model_column}/{id_column}" for owner, model_column, id_column in columns.pairs
                 if owner == table and row[model_column] in AGENT_MODEL_NAMES and row[id_column] in ids]
        return plain + pairs

    def clashing_groups(self, fold: EnvironmentFold, unique: UniqueKey, column: str, model_column: str | None) -> list[list[dict[str, object]]]:
        folded_ids = {agent.id for agent in fold.folded}
        groups: dict[tuple[object, ...], list[dict[str, object]]] = {}
        for row in self.rewrite.guarded_rows(unique, column, [*folded_ids, fold.survivor.id]):
            if model_column is not None and row[model_column] not in AGENT_MODEL_NAMES:
                continue
            folded_key = tuple(fold.survivor.id if name == column and row[name] in folded_ids else row[name] for name in unique.columns)
            groups.setdefault(folded_key, []).append(row)
        return [rows for rows in groups.values() if len(rows) > 1]
