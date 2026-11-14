import os
import shutil
import tempfile
from pathlib import Path

import pytest

from server.door.hosted_journal_door import HostedJournalDoor
from tests.integration.support.hosted_viewer import hosted_viewer_factory
from tests.integration.support.integration_server import integration_server


@pytest.fixture
def socket_path():
    folder = Path(tempfile.mkdtemp(dir="/tmp"))
    yield folder / "viewer.sock"
    shutil.rmtree(folder)


# the server of a hosted journal: its viewer on a socket file for the proxy, beside the journal socket
@pytest.fixture
def hosted_server(journal, socket_path):
    with integration_server(journal, viewer_factory=hosted_viewer_factory(socket_path, os.getuid())) as server:
        yield server, socket_path


@pytest.fixture
def local_server(journal):
    with integration_server(journal) as server:
        yield server


@pytest.fixture
def agent_server(journal):
    with integration_server(journal, journal_door=HostedJournalDoor(os.getuid() + 1)) as server:
        yield server


# a journal with three open tasks, First, Second and Third, made through its console
@pytest.fixture
def tasks_journal(journal):
    for title in ("First", "Second", "Third"):
        assert journal.run(f'task make "{title}" --brief "A task to list"').code == 0
    return journal


@pytest.fixture
def task_server(tasks_journal):
    with integration_server(tasks_journal) as server:
        yield server


# a user, Ada, logged in to the viewer: the server, her cookie and her actor
@pytest.fixture
def person_server(journal):
    user = journal.make_user()
    with integration_server(journal) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user
