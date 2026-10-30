import sqlite3
from dataclasses import dataclass
from enum import StrEnum

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.database.triggers import Triggers
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.model.tables import Tables
from tests.core.base.test_lifecycle import LoanLifecycle, LoanState


class LoanKind(StrEnum):
    SHORT = "short"
    LONG = "long"


@dataclass(frozen=True, kw_only=True)
class Loan(Model):
    name = "loan"
    cli_noun = "loan"
    lifecycle = LoanLifecycle

    title: str
    state: LoanState = LoanState.LENT
    kind: LoanKind = LoanKind.SHORT


@pytest.fixture
def database(tmp_path):
    opened = Database.opened(JournalHome(tmp_path))
    opened.update(Statement("CREATE TABLE loans (id INTEGER PRIMARY KEY, title TEXT NOT NULL, state TEXT NOT NULL, kind TEXT NOT NULL) STRICT"))
    Triggers(opened, Tables()).rebuild((Loan,))
    yield opened
    opened.close()


def refused(database: Database, sql: str) -> str:
    with pytest.raises(sqlite3.IntegrityError) as caught:
        database.update(Statement(sql))
    return str(caught.value)


def test_a_new_row_starts_only_in_an_initial_state(database):
    assert refused(database, "INSERT INTO loans (title, state, kind) VALUES ('Dune', 'returned', 'short')") == "rule: a new loan starts as lent"
    database.insert(Statement("INSERT INTO loans (title, state, kind) VALUES ('Dune', 'lent', 'short')"))


def test_a_state_changes_only_along_a_move_and_an_unchanged_state_passes(database):
    database.insert(Statement("INSERT INTO loans (title, state, kind) VALUES ('Dune', 'lent', 'short')"))
    database.update(Statement("UPDATE loans SET title = 'Dune Messiah', state = 'lent'"))
    database.update(Statement("UPDATE loans SET state = 'returned'"))
    assert refused(database, "UPDATE loans SET state = 'late'").startswith("rule: no move of a loan")


def test_a_row_is_deleted_only_in_a_deletable_state(database):
    database.insert(Statement("INSERT INTO loans (title, state, kind) VALUES ('Dune', 'lent', 'short')"))
    database.update(Statement("UPDATE loans SET state = 'late'"))
    assert refused(database, "DELETE FROM loans") == "rule: a loan in that state cannot be deleted"


def test_an_enum_column_takes_only_its_enum_values(database):
    assert refused(database, "INSERT INTO loans (title, state, kind) VALUES ('Dune', 'lent', 'forever')") == "rule: a loan's kind is one of short, long"
    database.insert(Statement("INSERT INTO loans (title, state, kind) VALUES ('Dune', 'lent', 'long')"))
    assert refused(database, "UPDATE loans SET kind = 'forever'") == "rule: a loan's kind is one of short, long"


def test_rebuilding_twice_leaves_one_set_of_triggers(database):
    Triggers(database, Tables()).rebuild((Loan,))
    names = [row["name"] for row in database.rows(Statement("SELECT name FROM sqlite_master WHERE type = 'trigger' ORDER BY name"))]
    assert names == ["loans_rule_kind_insert", "loans_rule_kind_update", "loans_rule_state_delete", "loans_rule_state_insert", "loans_rule_state_move"]
