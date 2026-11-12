import json
from dataclasses import dataclass, field

from engine.database.database import Database
from engine.database.reference_rewrite import SCHEMA_REASON, ReferenceRewrite
from engine.database.schema_columns import SchemaColumns
from engine.database.statement import Statement
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from engine.model.table import Table
from core.modules.agents.models.agent import MAIN_NUMBER, Agent
from core.modules.agents.support.fold_clash_rules import FoldClashRules
from core.modules.agents.support.main_fold_plan import EnvironmentFold, MainFoldPlan
from core.modules.agents.support.reference_columns import AGENT_MODEL_NAMES, AgentColumns, ReferenceColumns

SESSIONS = ("agent_sessions", "session_agent_id")
AGENTS_TABLE = "agents"
ACTORS_TABLE = "actors"
FOLD_TABLES = ("agent_folds", "agent_fold_rows")
FOLD_RECORD = ("INSERT INTO agent_folds (environment_id, folded_agent_id, survivor_id, folded_number, agent_row, actor_row, sessions,"
               " folded_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id")
MAIN_ROWS = Statement("SELECT * FROM agents WHERE role = ?", [AgentRole.MAIN.value], scan_reason=SCHEMA_REASON)
FOLD_ROW_RECORD = "INSERT INTO agent_fold_rows (environment_id, fold_id, table_name, row, rule, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"


@dataclass
class FoldCounts:
    """What a fold changed: per reference column the rows holding a folded agent or the survivor before and the
    survivor after, the rows a clash rule removed, and every table's row count before and after."""

    references: dict[str, tuple[int, int]] = field(default_factory=dict)
    removed: dict[str, int] = field(default_factory=dict)
    tables_before: dict[str, int] = field(default_factory=dict)
    tables_after: dict[str, int] = field(default_factory=dict)
    rules: dict[str, int] = field(default_factory=dict)

    def add_reference(self, name: str, before: int, after: int) -> None:
        earlier_before, earlier_after = self.references.get(name, (0, 0))
        self.references[name] = (earlier_before + before, earlier_after + after)

    def add_removed(self, table: str, reference: str, rule: str, count: int) -> None:
        for name in (table, reference):
            self.removed[name] = self.removed.get(name, 0) + count
        self.rules[f"{table}: {rule}"] = self.rules.get(f"{table}: {rule}", 0) + count

    def mismatches(self, folded_count: int) -> list[str]:
        moved = [f"{name}: {before} before, {after} after" for name, (before, after) in self.references.items()
                 if after != before - self.removed.get(name, 0)]
        gone = {AGENTS_TABLE: folded_count, ACTORS_TABLE: folded_count}
        changed = [f"{table}: {count} rows before, {self.tables_after.get(table)} after" for table, count in self.tables_before.items()
                   if table not in FOLD_TABLES and self.tables_after.get(table) != count - gone.get(table, 0) - self.removed.get(table, 0)]
        return moved + changed


class MainFold:
    """Folds the older main agent rows of each environment into its one main agent in one transaction with
    foreign keys off: settles the rows that would clash, moves the sessions first, points every column and model
    pair that holds a folded agent at the survivor, records each folded agent whole, removes the folded rows and
    gives the survivor number 1, then compares the counts and the keys and rolls everything back on a mismatch."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.rewrite = ReferenceRewrite(database)

    def plan(self) -> tuple[EnvironmentFold, ...]:
        table = Table.build(Agent)
        return MainFoldPlan.folds([table.row_model(row) for row in self.database.rows(MAIN_ROWS)])

    def run(self, folds: tuple[EnvironmentFold, ...], folded_at: str) -> FoldCounts:
        counts = FoldCounts()
        if not folds:
            return counts
        schema = SchemaColumns(self.database).columns()
        columns = ReferenceColumns.agent_columns(schema)
        tables = sorted({column.table for column in schema})
        self.database.update(Statement("PRAGMA foreign_keys = OFF"))
        try:
            with self.database.transaction():
                counts.tables_before = self.rewrite.table_counts(tables)
                for fold in folds:
                    self.fold(fold, columns, counts, folded_at)
                counts.tables_after = self.rewrite.table_counts(tables)
                self.check(counts, sum(len(fold.folded) for fold in folds))
        finally:
            self.database.update(Statement("PRAGMA foreign_keys = ON"))
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
        self.database.update(Statement('UPDATE "agents" SET number = ? WHERE id = ?', [MAIN_NUMBER, fold.survivor.id]))

    def reference_counts(self, columns: AgentColumns, ids: list[int]) -> dict[str, int]:
        plain = {f"{table}.{column}": self.rewrite.count(table, column, ids) for table, column in columns.plain}
        pairs = {f"{table}.{model_column}/{id_column}": self.rewrite.pair_count(table, model_column, id_column, AGENT_MODEL_NAMES, ids)
                 for table, model_column, id_column in columns.pairs}
        return plain | pairs

    def record(self, fold: EnvironmentFold, agent: Agent, folded_at: str) -> int:
        agent_rows = self.rewrite.rows(AGENTS_TABLE, "id", [agent.id])
        actor_rows = self.rewrite.rows(ACTORS_TABLE, "id", [agent.id])
        sessions = self.rewrite.rows(*SESSIONS, [agent.id])
        values = [fold.environment_id, agent.id, fold.survivor.id, agent.number, json.dumps(agent_rows[0], default=str),
                  json.dumps(actor_rows[0] if actor_rows else {}, default=str), json.dumps(sessions, default=str), folded_at, folded_at, folded_at]
        return int(self.database.rows(Statement(FOLD_RECORD, values))[0]["id"])

    def settle_clashes(self, fold: EnvironmentFold, columns: AgentColumns, counts: FoldCounts, fold_id: int, folded_at: str) -> None:
        for table, key in self.rewrite.unique_keys():
            if table in FOLD_TABLES:
                continue
            for column, model_column, name in MainFold.agent_parts(columns, table, key):
                for group in self.clashing_groups(fold, table, key, column, model_column):
                    settled = FoldClashRules.settled(table, group, fold.survivor.id, column)
                    for removed in settled.removed:
                        self.database.update(Statement(FOLD_ROW_RECORD, [fold.environment_id, fold_id, table, json.dumps(removed, default=str),
                                                                         settled.rule, folded_at, folded_at]))
                    self.rewrite.delete_past_state_rule(table, [int(row["id"]) for row in settled.removed])
                    counts.add_removed(table, name, settled.rule, len(settled.removed))

    @staticmethod
    def agent_parts(columns: AgentColumns, table: str, key: tuple[str, ...]) -> list[tuple[str, str | None, str]]:
        plain = [(column, None, f"{table}.{column}") for owner, column in columns.plain if owner == table and column in key]
        pairs = [(id_column, model_column, f"{table}.{model_column}/{id_column}") for owner, model_column, id_column in columns.pairs
                 if owner == table and model_column in key and id_column in key]
        return plain + pairs

    def clashing_groups(self, fold: EnvironmentFold, table: str, key: tuple[str, ...], column: str, model_column: str | None) -> list[list[dict[str, object]]]:
        folded_ids = {agent.id for agent in fold.folded}
        groups: dict[tuple[object, ...], list[dict[str, object]]] = {}
        for row in self.rewrite.rows(table, column, [*folded_ids, fold.survivor.id]):
            if model_column is not None and row[model_column] not in AGENT_MODEL_NAMES:
                continue
            folded_key = tuple(fold.survivor.id if name == column and row[name] in folded_ids else row[name] for name in key)
            groups.setdefault(folded_key, []).append(row)
        return [rows for rows in groups.values() if len(rows) > 1]
