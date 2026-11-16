import sqlite3
from pathlib import Path

import pytest
from engine.text.listed_lines import ListedLines

UNIT_FOLDER = Path(__file__).resolve().parent
ROOT = UNIT_FOLDER.parents[1]
DATABASE_UNIT_TESTS = UNIT_FOLDER / "database_unit_tests.txt"
REFUSAL = "a unit test opens no database: build the unit with plain fakes, or the check belongs in a story (task 10183)"


class UnitDatabaseGuard:
    """Refuses every database a unit test opens, except in the files of a list that only shrinks: a unit test checks
    the mechanics between our classes and loads no database (user 124489)."""

    def __init__(self, list_file: Path = DATABASE_UNIT_TESTS) -> None:
        lines = list_file.read_text().splitlines() if list_file.exists() else []
        self.allowed = frozenset(ListedLines.of(lines))

    def allows(self, test_file: Path) -> bool:
        return test_file.relative_to(ROOT).as_posix() in self.allowed

    @staticmethod
    def refused_connect(*arguments, **keywords):
        raise AssertionError(REFUSAL)


GUARD = UnitDatabaseGuard()


@pytest.fixture(autouse=True)
def unit_database_guard(request: pytest.FixtureRequest, monkeypatch: pytest.MonkeyPatch) -> None:
    if not GUARD.allows(request.path):
        monkeypatch.setattr(sqlite3, "connect", UnitDatabaseGuard.refused_connect)
