from pathlib import Path

import pytest

from journal.db.connection import Connection
from journal.db.schema import Schema
from journal.features.bus import Bus
from journal.models.all_models import AllModels
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope


@pytest.fixture
def connection(tmp_path: Path) -> Connection:
    connection = Connection(tmp_path / "journal.db")
    Schema(connection, AllModels.MODELS).create()
    yield connection
    connection.close()


@pytest.fixture
def bus() -> Bus:
    return Bus()


@pytest.fixture
def scope(connection: Connection, bus: Bus) -> Scope:
    return Scope(Environments(connection, bus))
