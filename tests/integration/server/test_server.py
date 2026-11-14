import json
from pathlib import Path

import pytest

from engine.database.registry_table import RegistryTable
from engine.serving.server_files import ServerFiles
from tests.integration.support.code_folders import SampleCodeFolders
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_process import ServerProcess

SCHEMA_EXAMPLES = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "event" / "testdata" / "schema"
SCHEMA_EDIT = json.loads((SCHEMA_EXAMPLES / "edit.json").read_text())
SCHEMA_STOP = json.loads((SCHEMA_EXAMPLES / "stop.json").read_text())
TASK_LIST = "task list --environment main"


@pytest.fixture
def tasks_journal(journal):
    for title in ("First", "Second", "Third"):
        assert journal.run(f'task make "{title}" --brief "A task to list"').code == 0
    return journal


def older_registry(journal, entries_change: str = "") -> None:
    connection = journal.database.connection
    connection.execute(f"UPDATE registry SET fingerprint = 'older code'{entries_change}")
    connection.commit()


def test_a_request_after_the_code_changed_gets_409_runs_nothing_and_the_server_releases_its_files(tasks_journal, tmp_path):
    code_file = tmp_path / "code" / "a.py"
    code_file.parent.mkdir()
    code_file.write_text("x = 1\n")
    listing = tasks_journal.run(TASK_LIST).text
    with integration_server(tasks_journal, code_folders=SampleCodeFolders([code_file.parent])) as server:
        code_file.write_text("x = 22\n")
        answer = server.request("POST", "/cli", {"argv": ["task", "make", "Fourth", "--environment", "main"], "folder": "/"})
        assert answer.status == 409 and "newer code" in answer.text, answer
        assert tasks_journal.run(TASK_LIST).text == listing
        files = ServerFiles(tasks_journal.home)
        assert not server.socket_path.exists() and not files.pid_file.exists() and files.acquire_lock(), "the stale server still holds its files"
        files.release_lock()


def test_a_server_that_starts_on_changed_code_syncs_before_it_takes_a_request(tasks_journal):
    older_registry(tasks_journal)
    with ServerProcess(tasks_journal.home) as server:
        server.expect_health()
    assert RegistryTable(tasks_journal.database).row()["fingerprint"] != "older code"


def test_a_server_syncs_when_its_old_registry_binds_a_class_that_is_gone(tasks_journal):
    older_registry(tasks_journal, ", entries = json_set(entries, '$.bindings.\"core.gone:Interface\"', 'core.gone:Gone')")
    with ServerProcess(tasks_journal.home) as server:
        server.expect_health()
    row = RegistryTable(tasks_journal.database).row()
    assert row["fingerprint"] != "older code" and "core.gone" not in row["entries"]


def test_a_hook_on_code_newer_than_the_registry_goes_through_unchecked_and_a_stop_is_held(tasks_journal):
    older_registry(tasks_journal)
    with integration_server(tasks_journal) as server:
        server.expect_hook_answer("/hook", SCHEMA_EDIT, 200, "the journal let this through unchecked: the journal's modules changed")
        server.expect_hook_answer("/hook", SCHEMA_STOP, 200, "the journal could not check this stop and holds it")


def test_a_stop_request_is_answered_and_the_server_stops(tasks_journal):
    with integration_server(tasks_journal) as server:
        server.expect_stop()


def test_a_server_process_stopped_by_sigterm_removes_its_socket_and_pid_file_and_lets_the_lock_go(tasks_journal):
    with ServerProcess(tasks_journal.home) as server:
        server.expect_health()
        server.expect_sigterm_stop()


def test_a_second_server_process_beside_a_running_one_exits_at_once(tasks_journal):
    with ServerProcess(tasks_journal.home) as server:
        server.expect_health()
        server.expect_second_server_exits()


def test_a_stop_ends_the_server_at_once_while_a_client_still_holds_its_connection_open(tasks_journal):
    with ServerProcess(tasks_journal.home) as server:
        server.expect_health()
        server.expect_idle_connection_stop()
