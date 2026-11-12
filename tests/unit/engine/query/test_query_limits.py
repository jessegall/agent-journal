import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.table_statements import TableStatements
from engine.errors.read_cut_error import ReadCutError
from engine.errors.read_limit_error import ReadLimitError
from engine.model.tables import Tables
from engine.query.errors.query_limit_error import QueryLimitError
from engine.query.query import Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import FIXED_TIME, entries  # noqa: F401  (the shared fixture)

READ_LIMIT_ROWS = 50
WALK_HINT = "a read names at most 1000 rows; walk the rows with every_row(reason) if you need them all"
WALK_REASON = "the test reads every entry"


def filled(entries: Query[LogEntry], total: int) -> Query[LogEntry]:
    """The entries table grown from its seven rows to the given number of rows."""
    table = Tables().table(LogEntry)
    statements = TableStatements(table)
    for number in range(total - 7):
        entries.database.insert(statements.insert(table.row(LogEntry(title=f"More {number}"), table.columns), FIXED_TIME))
    return entries


@pytest.fixture
def statements_run(monkeypatch):
    ran: list[str] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        ran.append(statement.sql)
        return original(database, statement)

    monkeypatch.setattr(Database, "rows", counted)
    return ran


def test_get_on_sixty_rows_returns_fifty_and_reads_fifty_one(entries: Query[LogEntry], statements_run):
    assert len(filled(entries, 60).get()) == 50 and statements_run[-1].endswith("LIMIT 51")


def test_a_cut_is_reported_once_with_the_statement_and_the_calling_line(entries: Query[LogEntry]):
    entries.database.collected_large_reads = []
    filled(entries, 60)
    for _ in range(2):
        entries.get()
    reports = entries.database.collected_large_reads
    assert len(reports) == 1 and isinstance(reports[0], ReadCutError) and "read cut at 50 rows: SELECT * FROM log_entries" in str(reports[0]) and "test_query_limits.py" in str(reports[0])


def test_get_on_fifty_rows_reports_nothing(entries: Query[LogEntry]):
    entries.database.collected_large_reads = []
    assert len(filled(entries, 50).get()) == 50 and entries.database.collected_large_reads == []


def test_a_cut_does_not_fail_the_command_and_is_recorded_with_the_read_limit_setting_off(entries: Query[LogEntry]):
    entries.database.collected_large_reads = None
    assert len(filled(entries, 60).get()) == 50
    assert len(entries.database.read_cuts) == 1 and "read cut at 50 rows" in str(entries.database.read_cuts[0])


def test_a_cut_raises_where_cuts_raise_as_under_the_story_kit(entries: Query[LogEntry]):
    entries.database.cuts_raise = True
    with pytest.raises(ReadCutError, match="read cut at 50 rows"):
        filled(entries, 60).get()


def test_get_with_no_order_reads_by_key(entries: Query[LogEntry], statements_run):
    rows = filled(entries, 60).get()
    assert [row.id for row in rows] == list(range(1, 51)) and "ORDER BY id" in statements_run[-1]


def test_take_gives_the_newest_rows_named_and_reports_no_cut(entries: Query[LogEntry]):
    entries.database.collected_large_reads, entries.database.cuts_raise = [], True
    rows = filled(entries, 60).newest().take(5)
    assert [row.id for row in rows] == [60, 59, 58, 57, 56] and entries.database.collected_large_reads == [] and entries.database.read_cuts == []


def test_limit_two_hundred_returns_two_hundred_in_one_statement_and_passes_the_read_limit_check(entries: Query[LogEntry], statements_run):
    entries.database.read_limit_rows = READ_LIMIT_ROWS
    assert len(filled(entries, 300).limit(200, "a story reads 200 rows").get()) == 200 and len(statements_run) == 1


def test_a_cut_at_a_named_limit_is_reported(entries: Query[LogEntry]):
    entries.database.collected_large_reads = []
    filled(entries, 300).limit(200, "a story reads 200 rows").get()
    assert "read cut at 200 rows" in str(entries.database.collected_large_reads[0])


@pytest.mark.parametrize("rows", [5000, 10_000])
def test_a_limit_above_the_ceiling_is_refused_with_the_walk_hint(entries: Query[LogEntry], rows):
    with pytest.raises(QueryLimitError) as refused:
        entries.limit(rows, "a test names the limit")
    assert str(refused.value) == WALK_HINT


def test_every_row_gives_each_matching_row_in_statements_of_fifty(entries: Query[LogEntry], monkeypatch):
    sizes: list[int] = []
    original = Database.rows

    def counted(database: Database, statement: Statement):
        rows = original(database, statement)
        sizes.append(len(rows))
        return rows

    filled(entries, 120)
    monkeypatch.setattr(Database, "rows", counted)
    ids = [row.id for row in entries.every_row(WALK_REASON)]
    assert sizes == [50, 50, 20] and ids == list(range(1, 121))


def test_every_row_with_an_empty_reason_is_refused(entries: Query[LogEntry]):
    with pytest.raises(QueryLimitError, match="say why every row is needed"):
        entries.every_row("  ")


def test_first_exists_and_count_are_not_cut_and_report_nothing(entries: Query[LogEntry]):
    entries.database.collected_large_reads = []
    filled(entries, 60)
    assert entries.first().id == 1 and entries.exists() and entries.count() == 60 and entries.database.collected_large_reads == []


def test_page_one_reads_twenty_five_and_a_count(entries: Query[LogEntry], statements_run):
    page = filled(entries, 60).page(1)
    assert len(page.rows) == 25 and page.total == 60 and statements_run[-2].endswith("LIMIT 25") and statements_run[-1].startswith("SELECT count(*)")


def test_page_one_size_fifty_reads_fifty(entries: Query[LogEntry]):
    assert len(filled(entries, 60).page(1, 50).rows) == 50


def test_page_one_size_eighty_is_a_named_limit_and_passes_the_read_limit(entries: Query[LogEntry]):
    entries.database.read_limit_rows = READ_LIMIT_ROWS
    assert len(filled(entries, 100).page(1, 80).rows) == 80


def test_the_read_limit_still_refuses_a_hand_written_statement_over_fifty_rows(entries: Query[LogEntry]):
    filled(entries, 60)
    entries.database.read_limit_rows = READ_LIMIT_ROWS
    with pytest.raises(ReadLimitError):
        entries.database.rows(Statement("SELECT * FROM log_entries"))


def test_a_statement_is_checked_against_its_own_named_limit(entries: Query[LogEntry]):
    filled(entries, 250)
    entries.database.read_limit_rows = READ_LIMIT_ROWS
    assert len(entries.database.rows(Statement("SELECT * FROM log_entries LIMIT 150", named_limit_rows=200))) == 150
    with pytest.raises(ReadLimitError):
        entries.database.rows(Statement("SELECT * FROM log_entries", named_limit_rows=200))


def test_calling_all_rows_fails_because_the_method_is_gone():
    assert not hasattr(Query, "all_rows") and not hasattr(Query, "limited")
