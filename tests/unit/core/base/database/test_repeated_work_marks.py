import pytest

from core.base.database.repeated_calls_error import RepeatedCallsError
from core.base.database.repeated_work import RepeatedWork
from core.base.database.statement import Statement

VERSION_CHECK = Statement("SELECT id, version FROM agents WHERE id IN (?)", [694])


class MarkedDatabase:
    """A stand-in database whose content mark moves when another connection commits."""

    def __init__(self) -> None:
        self.mark = (1, 0, 0)

    def content_mark(self) -> tuple[int, int, int]:
        return self.mark

    def query_plan(self, statement: Statement) -> tuple[str, ...]:
        return ()

    def is_partial_index(self, name: str) -> bool:
        return False


def read(work: RepeatedWork, database: MarkedDatabase, commit_during_read: bool) -> None:
    work.mark_read()
    if commit_during_read:
        database.mark = (database.mark[0] + 1, 0, 0)
    work.loaded([], VERSION_CHECK)


def test_a_commit_during_the_first_read_files_the_second_read_as_new_work():
    database = MarkedDatabase()
    work = RepeatedWork(database)
    with work.request():
        read(work, database, commit_during_read=True)
        read(work, database, commit_during_read=False)


def test_the_same_read_twice_with_no_commit_is_a_repeat():
    database = MarkedDatabase()
    work = RepeatedWork(database)
    with pytest.raises(RepeatedCallsError), work.request():
        read(work, database, commit_during_read=False)
        read(work, database, commit_during_read=False)
