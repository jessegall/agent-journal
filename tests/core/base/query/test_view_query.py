from dataclasses import dataclass

import pytest

from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.journal_home import JournalHome
from core.base.missing_rows import MissingRows
from core.base.model.tables import Tables
from core.base.model.view_model import ViewModel
from core.base.query.queries import Queries


@dataclass(frozen=True, kw_only=True)
class ShelfCount(ViewModel):
    cli_noun = "shelf"
    view = "shelf_counts"
    key = "shelf_id"

    shelf_id: int
    book_count: int


@pytest.fixture
def queries(tmp_path):
    database = Database.opened(JournalHome(tmp_path))
    for sql in ("CREATE TABLE shelves (id INTEGER PRIMARY KEY) STRICT",
                "CREATE TABLE books (id INTEGER PRIMARY KEY, shelf_id INTEGER NOT NULL) STRICT",
                "CREATE VIEW shelf_counts AS SELECT shelves.id AS shelf_id, count(books.id) AS book_count FROM shelves LEFT JOIN books ON books.shelf_id = shelves.id GROUP BY shelves.id",
                "INSERT INTO shelves (id) VALUES (1), (2)", "INSERT INTO books (shelf_id) VALUES (1), (1)"):
        database.update(Statement(sql))
    yield Queries(database, Tables())
    database.close()


def test_a_views_row_is_found_by_its_key(queries: Queries):
    counts = queries.view_query(ShelfCount)
    assert counts.find(1) == ShelfCount(shelf_id=1, book_count=2)
    assert counts.find(2) == ShelfCount(shelf_id=2, book_count=0)


def test_a_key_with_no_row_is_refused(queries: Queries):
    with pytest.raises(MissingRows, match="no shelf 9"):
        queries.view_query(ShelfCount).find(9)
