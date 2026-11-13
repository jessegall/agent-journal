from dataclasses import dataclass, field
from core.modules.agents.models.agent import AGENTS_TABLE
from core.modules.agents.support.reference_columns import FOLD_TABLES

ACTORS_TABLE = "actors"


@dataclass
class FoldCounts:
    """What a fold changed: per reference column the rows holding a folded agent or the survivor before and the
    survivor after, the rows a clash rule removed, and every table's row count before and after."""

    references: dict[str, tuple[int, int]] = field(default_factory=dict)
    removed: dict[str, int] = field(default_factory=dict)
    tables_prior: dict[str, int] = field(default_factory=dict)
    tables_after: dict[str, int] = field(default_factory=dict)
    rules: dict[str, int] = field(default_factory=dict)

    def add_reference(self, name: str, before: int, after: int) -> None:
        earlier_before, earlier_after = self.references.get(name, (0, 0))
        self.references[name] = (earlier_before + before, earlier_after + after)

    def add_removed(self, table: str, references: list[str], rule: str) -> None:
        for name in (table, *references):
            self.removed[name] = self.removed.get(name, 0) + 1
        self.rules[f"{table}: {rule}"] = self.rules.get(f"{table}: {rule}", 0) + 1

    def mismatches(self, folded_count: int) -> list[str]:
        moved = [f"{name}: {before} before, {after} after" for name, (before, after) in self.references.items()
                 if after != before - self.removed.get(name, 0)]
        gone = {AGENTS_TABLE: folded_count, ACTORS_TABLE: folded_count}
        changed = [f"{table}: {count} rows before, {self.tables_after.get(table)} after" for table, count in self.tables_prior.items()
                   if table not in FOLD_TABLES and self.tables_after.get(table) != count - gone.get(table, 0) - self.removed.get(table, 0)]
        return moved + changed
