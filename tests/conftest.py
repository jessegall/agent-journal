import os
import shutil
import tempfile
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.db.masks import Masks
from journal.features.faults.slow_requests import TESTS_RUNNING
from journal.secret_values import SecretValues

from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.events.bus import Bus
from journal.models.all_models import AllModels
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope


os.environ["AGENT_JOURNAL_SECRETS"] = tempfile.mkdtemp(prefix="journal-test-values-")
"""Every test, and every journal a test boots, keeps its secret values in a scratch folder, never the user's own."""

TESTS_MARK = Path(__file__).resolve().parent.parent / ".journal" / "runtime" / TESTS_RUNNING


def pytest_sessionstart(session) -> None:
    """The checkout's own journal is told a run is on, so its profiler does not blame itself for the machine the suite crowds."""
    if TESTS_MARK.parent.is_dir():
        TESTS_MARK.write_text(str(os.getpid()))


def pytest_sessionfinish(session, exitstatus) -> None:
    TESTS_MARK.unlink(missing_ok=True)


@pytest.fixture
def connection(tmp_path: Path) -> Connection:
    connection = Connection(tmp_path / "journal.db", Masks(SecretValues(Config(tmp_path))))
    Schema(connection, AllModels.MODELS).create()
    yield connection
    connection.close()


@pytest.fixture
def bus() -> Bus:
    return Bus()


@pytest.fixture(scope="session")
def template_journal(tmp_path_factory) -> Path:
    """One journal booted for the whole run, its schema made and its seeds drawn; a test that boots a journal starts from a copy of it, which boots in a hundredth of the time."""
    root = tmp_path_factory.mktemp("template")
    app = App(Config(root, port=0))
    app.runtime().start()
    app.runtime().stop()
    return root


@pytest.fixture
def journal_root(tmp_path: Path, template_journal: Path) -> Path:
    """The test's own journal folder, a copy of the booted template, with a project id of its own so no two tests share secret values."""
    shutil.copytree(template_journal, tmp_path, dirs_exist_ok=True)
    (tmp_path / ".journal" / "project-id").unlink(missing_ok=True)
    return tmp_path


@pytest.fixture
def scope(connection: Connection, bus: Bus) -> Scope:
    return Scope(Environments(connection, bus))
