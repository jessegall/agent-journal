import os
import shutil
import tempfile
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.support.masks import Masks
from journal.features.faults.support.test_run_files import TEST_RUN_KEY
from journal.support.secret_values import SecretValues

from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.events.bus import Bus
from journal.models.all_models import AllModels
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from tests.shared_journal import SharedJournal


os.environ["AGENT_JOURNAL_SECRETS"] = tempfile.mkdtemp(prefix="journal-test-values-")
"""Every test, and every journal a test boots, keeps its secret values in a scratch folder, never the user's own."""

TESTS_MARK = Path(__file__).resolve().parent.parent / ".journal" / "runtime" / f"{TEST_RUN_KEY}.{os.getpid()}"


def pytest_sessionstart(session) -> None:
    """The checkout's own journal is told a run is on, so its profiler does not blame itself for the machine the suite crowds."""
    if TESTS_MARK.parent.is_dir():
        TESTS_MARK.touch()


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
    return copied(template_journal, tmp_path)


@pytest.fixture(scope="module")
def journal(tmp_path_factory, template_journal: Path, boot) -> SharedJournal:
    """The journal a module's tests share, a copy of the booted template with a project id of its own, booted by the module's own boot fixture."""
    with pytest.MonkeyPatch.context() as patch:
        app = boot(copied(template_journal, tmp_path_factory.mktemp("module")), patch)
        yield SharedJournal(app)
        app.runtime().stop()


@pytest.fixture
def app(journal: SharedJournal):
    """The module's journal, put back as it booted once the test is done."""
    yield journal.app
    journal.reset()


def copied(template: Path, root: Path) -> Path:
    shutil.copytree(template, root, dirs_exist_ok=True)
    (root / ".journal" / "project-id").unlink(missing_ok=True)
    return root


@pytest.fixture
def scope(connection: Connection, bus: Bus) -> Scope:
    return Scope(Environments(connection, bus))
