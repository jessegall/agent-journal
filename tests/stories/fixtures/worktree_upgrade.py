import sqlite3
from pathlib import Path

from tests.stories.fixtures.version_four import version_four_fixture
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

LEGACY_BRANCH = "development"


def prepare_worktree_upgrade(folder: Path) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    database = version_four_fixture(folder / "journal.db")
    with sqlite3.connect(database) as connection:
        connection.execute("UPDATE environments SET branch = ? WHERE name = 'side'", tuple([ENVIRONMENT_BRANCH]))
