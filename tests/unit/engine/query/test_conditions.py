import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.query.conditions.among import Among
from engine.query.conditions.equal import Equal
from engine.query.conditions.greater import Greater
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.conditions.maximum import Maximum
from engine.query.conditions.metadata_equal import MetadataEqual
from engine.query.errors.metadata_key_error import MetadataKeyError
from engine.query.conditions.prefix import Prefix


def test_each_condition_gives_its_sql_and_parameters():
    assert Equal("state", "open").statement() == Statement("state = ?", ["open"])
    assert Equal("state", "open", negated=True).statement() == Statement("state IS NOT ?", ["open"])
    assert Less("id", 12).statement() == Statement("id < ?", [12])
    assert Maximum("id", 12).statement() == Statement("id <= ?", [12])
    assert Greater("id", 12).statement() == Statement("id > ?", [12])
    assert IsNull("closed_at").statement() == Statement("closed_at IS NULL")
    assert Among("id", (3, 4)).statement() == Statement("id IN (?, ?)", (3, 4))
    assert SubqueryMatch("id", Equal("plan_id", 4)).statement() == Statement("id IN (plan_id = ?)", [4])


def test_equal_and_unlike_none_read_as_null():
    assert Equal("holder_id", None).statement() == Statement("holder_id IS NULL")
    assert Equal("holder_id", None, negated=True).statement() == Statement("holder_id IS NOT NULL")


def test_among_nothing_matches_nothing():
    assert Among("id", ()).statement() == Statement("0")


def test_metadata_is_matched_by_module_and_key_on_a_stored_row(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement("CREATE TABLE notes (id INTEGER PRIMARY KEY, metadata TEXT NOT NULL) STRICT"))
    database.insert(Statement("INSERT INTO notes (metadata) VALUES (?)", ['{"reviews": {"asked": "yes"}}']))
    database.insert(Statement("INSERT INTO notes (metadata) VALUES (?)", ['{"reviews": {"asked": "no"}}']))
    condition = MetadataEqual("reviews", "asked", "yes").statement()
    assert [row["id"] for row in database.rows(Statement(f"SELECT id FROM notes WHERE {condition.sql}", condition.parameters))] == [1]


def test_metadata_named_with_anything_but_plain_titles_is_refused():
    with pytest.raises(MetadataKeyError):
        MetadataEqual("reviews", "asked') OR 1=1 --", "yes").statement()


@pytest.mark.parametrize("prefix", ["Book", "book", "B*", "B?", "B[", ""])
def test_a_prefix_is_literal_and_case_sensitive(tmp_path, prefix):
    database = Database.opened(JournalHome(tmp_path))
    titles = ("Book", "Books", "book", "B*ok", "B?ok", "B[ok")
    database.update(Statement("CREATE TABLE titles (title TEXT NOT NULL)"))
    for title in titles:
        database.insert(Statement("INSERT INTO titles VALUES (?)", [title]))
    condition = Prefix("title", prefix).statement()
    try:
        rows = database.rows(Statement(f"SELECT title FROM titles WHERE {condition.sql} ORDER BY rowid", condition.parameters))
        assert [row[0] for row in rows] == [title for title in titles if title.startswith(prefix)]
    finally:
        database.close()


def test_a_prefix_uses_the_text_index(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement("CREATE TABLE titles (title TEXT NOT NULL)"))
    database.update(Statement("CREATE INDEX titles_title ON titles (title)"))
    condition = Prefix("title", "Book").statement()
    try:
        plan = database.query_plan(Statement(f"SELECT title FROM titles WHERE {condition.sql}", condition.parameters))
        assert any("SEARCH titles USING COVERING INDEX titles_title" in line for line in plan), plan
    finally:
        database.close()
