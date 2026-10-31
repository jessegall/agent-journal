import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.query.conditions.among import Among
from core.base.query.conditions.equal import Equal
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.in_select import InSelect
from core.base.query.conditions.is_null import IsNull
from core.base.query.conditions.less import Less
from core.base.query.conditions.metadata_equal import MetadataEqual, MetadataKeyFault
from core.base.query.conditions.not_equal import NotEqual


def test_each_condition_gives_its_sql_and_parameters():
    assert Equal("state", "open").statement() == Statement("state = ?", ("open",))
    assert NotEqual("state", "open").statement() == Statement("state IS NOT ?", ("open",))
    assert Less("id", 12).statement() == Statement("id < ?", (12,))
    assert Greater("id", 12).statement() == Statement("id > ?", (12,))
    assert IsNull("closed_at").statement() == Statement("closed_at IS NULL")
    assert Among("id", (3, 4)).statement() == Statement("id IN (?, ?)", (3, 4))
    assert InSelect("id", Equal("plan_id", 4)).statement() == Statement("id IN (plan_id = ?)", (4,))


def test_equal_and_unlike_none_read_as_null():
    assert Equal("holder_id", None).statement() == Statement("holder_id IS NULL")
    assert NotEqual("holder_id", None).statement() == Statement("holder_id IS NOT NULL")


def test_among_nothing_matches_nothing():
    assert Among("id", ()).statement() == Statement("0")


def test_metadata_is_matched_by_module_and_key_on_a_stored_row(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement("CREATE TABLE notes (id INTEGER PRIMARY KEY, metadata TEXT NOT NULL) STRICT"))
    database.insert(Statement("INSERT INTO notes (metadata) VALUES (?)", ('{"reviews": {"asked": "yes"}}',)))
    database.insert(Statement("INSERT INTO notes (metadata) VALUES (?)", ('{"reviews": {"asked": "no"}}',)))
    condition = MetadataEqual("reviews", "asked", "yes").statement()
    assert [row["id"] for row in database.rows(Statement(f"SELECT id FROM notes WHERE {condition.sql}", condition.parameters))] == [1]


def test_metadata_named_with_anything_but_plain_words_is_refused():
    with pytest.raises(MetadataKeyFault):
        MetadataEqual("reviews", "asked') OR 1=1 --", "yes").statement()
