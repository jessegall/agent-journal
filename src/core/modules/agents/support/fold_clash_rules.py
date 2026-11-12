from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass

from engine.errors.refusal import Refusal

Row = Mapping[str, object]


@dataclass(frozen=True)
class SettledClash:
    """The row a clash keeps and the rows it removes, with the name of the rule that chose."""

    kept: Row
    removed: tuple[Row, ...]
    rule: str


def newest(rows: Sequence[Row], survivor_id: int, agent_column: str) -> Row:
    return max(rows, key=lambda row: int(row["id"]))


def oldest(rows: Sequence[Row], survivor_id: int, agent_column: str) -> Row:
    return min(rows, key=lambda row: int(row["id"]))


def latest_read(rows: Sequence[Row], survivor_id: int, agent_column: str) -> Row:
    return max(rows, key=lambda row: (str(row.get("read_at") or ""), int(row["id"])))


def survivors_else_newest(rows: Sequence[Row], survivor_id: int, agent_column: str) -> Row:
    own = [row for row in rows if row.get(agent_column) == survivor_id]
    return newest(own or rows, survivor_id, agent_column)


RULES: dict[str, tuple[str, Callable[[Sequence[Row], int, str], Row]]] = {
    "task_reads": ("keep the latest read", latest_read),
    "assignments": ("keep the survivor's, else the newest", survivors_else_newest),
    "agent_skills": ("keep the newest", newest),
    "subagent_dispatches": ("keep the newest", newest),
    "message_work_sources": ("keep the survivor's, else the newest", survivors_else_newest),
    "rule_histories": ("keep the newest", newest),
    "nudge_records": ("keep the oldest, when it was first given", oldest),
    "countdowns": ("keep the newest", newest),
    "reminder_passes": ("keep the newest", newest),
    "memory_marks": ("keep the survivor's open mark, else the newest", survivors_else_newest),
    "context_compactions": ("keep the survivor's open one, else the newest", survivors_else_newest),
    "links": ("keep the oldest", oldest),
    "link_corrections": ("keep the oldest", oldest),
    "helper_jobs": ("keep the newest", newest),
    "reader_requests": ("keep the newest", newest),
    "plan_context_reads": ("keep the newest", newest),
}


class FoldClashRules:
    """Settles the rows of one table that share a unique key once their folded agents become the survivor: the
    table's rule keeps one row and every other row goes to the fold record. A table with no rule refuses the
    fold and names itself, so no clash is settled by guessing."""

    @staticmethod
    def settled(table: str, rows: Sequence[Row], survivor_id: int, agent_column: str) -> SettledClash:
        if table not in RULES:
            raise Refusal(f"the fold has no rule for a clash on table {table}", "add a rule for it in FoldClashRules before the fold runs")
        name, choose = RULES[table]
        kept = choose(rows, survivor_id, agent_column)
        return SettledClash(kept, tuple(row for row in rows if row["id"] != kept["id"]), name)
