from pathlib import Path

import pytest

from engine.database.database import READ_LIMIT_ROWS
from engine.query.errors.query_limit_error import QueryLimitError
from engine.query.query import MOST_NAMED_LIMIT_ROWS, Query
from tests.unit.engine.model.test_table import LogEntry
from tests.unit.engine.query.test_query import entries  # noqa: F401  (the shared fixture)
from tests.unit.engine.query.test_query_limits import filled

"""Book 8 of doc 1255, stories 57 and 61: a read cannot get past the limit by naming a huge one, and no read the
builder makes needs the read limit switched off."""

ROOT = Path(__file__).resolve().parents[4]
WALK_REASON = "the test walks every entry it made"
BYPASS_LINES = {"src/engine/cli/read_limit_bypass.py": 'ALLOW_LARGE_READ_FLAG = "--allow-large-read"',
                "src/core/modules/developer/support/developer_settings.py": 'READ_LIMIT_SETTING = f"{TOOLS_SETTING}.read-limit"'}


def test_a_huge_limit_to_get_past_the_default_is_refused(entries: Query[LogEntry]):
    with pytest.raises(QueryLimitError, match="a read names at most 1000 rows; walk the rows with every_row"):
        entries.limit(10_000, WALK_REASON)
    assert MOST_NAMED_LIMIT_ROWS == 1000
    assert entries.limit(1000, WALK_REASON).select.limit == 1000


def test_a_builder_read_never_needs_the_read_limit_switched_off(entries: Query[LogEntry]):
    filled(entries, 300)
    entries.database.read_limit_rows = READ_LIMIT_ROWS
    assert READ_LIMIT_ROWS == 50
    assert len(entries.get()) == 50
    assert len(entries.limit(200, WALK_REASON).get()) == 200
    assert len(entries.page(1, size=80).rows) == 80
    assert len(list(entries.every_row(WALK_REASON))) == 300
    assert [path for path, line in BYPASS_LINES.items() if line not in (ROOT / path).read_text()] == []
