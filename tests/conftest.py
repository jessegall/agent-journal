from journal.config import Config
from journal.db.masks import Masks
from journal.secret_values import SecretValues
import shutil
from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config

from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.features.bus import Bus
from journal.models.all_models import AllModels
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope


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
    """The test's own journal folder, a copy of the booted template."""
    shutil.copytree(template_journal, tmp_path, dirs_exist_ok=True)
    return tmp_path


@pytest.fixture
def scope(connection: Connection, bus: Bus) -> Scope:
    return Scope(Environments(connection, bus))
