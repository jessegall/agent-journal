from engine.database.database import Database
from engine.database.statement import Statement
from engine.query.query import Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import entries  # noqa: F401  (the shared fixture)
from tests.unit.engine.query.test_query_limits import filled, statements_run  # noqa: F401  (the shared fixtures)

"""Book 9 of doc 1255: the builder makes no read slower than the reads it replaced."""

WALK_REASON = "the test walks every entry"


def test_get_runs_one_statement_with_limit_fifty_one(entries: Query[LogEntry], statements_run):
    filled(entries, 300)
    statements_run.clear()
    entries.get()
    assert len(statements_run) == 1 and statements_run[0].endswith("LIMIT 51")


def test_a_walk_reads_by_key_without_sorting_the_table_each_page(entries: Query[LogEntry], monkeypatch):
    filled(entries, 120)
    walked: list[Statement] = []
    original = Database.rows

    def kept(database: Database, statement: Statement):
        walked.append(statement)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", kept)
    assert len(list(entries.every_row(WALK_REASON))) == 120
    plan = " ".join(entries.database.query_plan(walked[-1]))
    assert "TEMP B-TREE" not in plan and ("PRIMARY KEY" in plan or "INDEX" in plan), plan
