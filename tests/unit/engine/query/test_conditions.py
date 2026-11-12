import json

import pytest

from engine.database.database import Database
from engine.database.statement import Statement
from engine.journal.journal_home import JournalHome
from engine.query.conditions.among import Among
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.duration_at_least import DurationAtLeast
from engine.query.conditions.glob_match import GlobMatch
from engine.query.conditions.interval_passed_since import IntervalPassedSince
from engine.query.conditions.json_list_empty import JsonListEmpty
from engine.query.conditions.row_value_before import RowValueBefore
from engine.query.conditions.text_contains import TextContains
from engine.query.errors.unknown_operator_error import UnknownOperatorError
from engine.query.conditions.equal import Equal
from engine.query.conditions.greater import Greater
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.conditions.maximum import Maximum
from engine.query.conditions.metadata_equal import MetadataEqual
from engine.query.conditions.metadata_list_differs import MetadataListDiffers
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


REFUSED_RULES = {1: [{"rule": "skipped", "outcome": "refused"}],
                 2: [{"rule": "skipped", "outcome": "refused"}, {"rule": "another", "outcome": "refused"}],
                 3: [],
                 4: [{"rule": "another", "outcome": "allowed"}, {"rule": "skipped", "outcome": "refused"}],
                 5: [{"outcome": "refused"}]}


def test_a_metadata_list_differs_when_an_element_of_its_kind_names_another_value_or_none_is_of_its_kind(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    database.update(Statement("CREATE TABLE calls (id INTEGER PRIMARY KEY, metadata TEXT NOT NULL) STRICT"))
    for row_id, rules in REFUSED_RULES.items():
        database.insert(Statement("INSERT INTO calls (id, metadata) VALUES (?, ?)", [row_id, json.dumps({"journal.core.drivers": {"rules": rules}})]))
    condition = MetadataListDiffers("journal.core.drivers", "rules", "outcome", "refused", "rule", "skipped").statement()
    assert [row["id"] for row in database.rows(Statement(f"SELECT id FROM calls WHERE {condition.sql} ORDER BY id", condition.parameters))] == [2, 3, 5]


def test_a_metadata_list_named_with_anything_but_plain_names_is_refused():
    with pytest.raises(MetadataKeyError):
        MetadataListDiffers("journal.core.drivers", "rules) OR 1=1 --", "outcome", "refused", "rule", "skipped").statement()


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


def test_any_of_joins_its_conditions_with_or_and_matches_nothing_when_empty():
    assert AnyOf([Equal("state", "open"), IsNull("closed_at")]).statement() == Statement("(state = ? OR closed_at IS NULL)", ["open"])
    assert AnyOf([]).statement() == Statement("0")


def test_all_of_joins_its_conditions_with_and_and_matches_every_row_when_empty():
    assert AllOf([Equal("state", "open"), Greater("id", 4)]).statement() == Statement("(state = ? AND id > ?)", ["open", 4])
    assert AllOf([]).statement() == Statement("1")


def test_the_new_conditions_give_their_sql_and_parameters_in_order():
    assert GlobMatch("key", "mark:round:*").statement() == Statement("key GLOB ?", ["mark:round:*"])
    assert ColumnCompare("tasks.id", "=", "proofs.task_id").statement() == Statement("tasks.id = proofs.task_id")
    assert TextContains("last_output", "not found").statement() == Statement("instr(last_output, ?) > 0", ["not found"])
    assert RowValueBefore(("closed_at", "id"), ("2026", 9)).statement() == Statement("(closed_at, id) < (?, ?)", ("2026", 9))
    assert JsonListEmpty("targets").statement() == Statement("json_array_length(targets) = 0")
    assert DurationAtLeast("started_at", "ended_at", 60).statement() == Statement("started_at > '' AND ended_at > '' AND (julianday(ended_at) - julianday(started_at)) * 86400 >= ?", [60])
    assert IntervalPassedSince("last_run_at", "interval_minutes", "2026-11-12T10:00:00").statement() == Statement(
        "(last_run_at IS NULL OR datetime(last_run_at, '+' || interval_minutes || ' minutes') <= datetime(?))", ["2026-11-12T10:00:00"])


def test_a_column_compare_refuses_an_unknown_operator():
    with pytest.raises(UnknownOperatorError):
        ColumnCompare("id", "LIKE", "other_id").statement()
