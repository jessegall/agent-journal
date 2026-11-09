from tests.stories.server.support.server_fixtures import task_server

import pytest

import json
from pathlib import Path

from core.base.database.database import Database
from core.base.database.registry_table import RegistryTable
from core.base.system_log_writer import LOG_LIMIT_BYTES
from server.server_files import ServerFiles
from tests.stories.core.support.fixtures import ThreeTasks
from tests.stories.server.support.code_folders import SampleCodeFolders
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.server_process import ServerProcess
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_absent_exists_version_four, expect_absent_exists_with_log, expect_changed_with, expect_exists_version_four

SCHEMA_EXAMPLES = Path(__file__).resolve().parents[3] / "tools" / "journal-hook" / "event" / "testdata" / "schema"
SCHEMA_EDIT = json.loads((SCHEMA_EXAMPLES / "edit.json").read_text())
SCHEMA_STOP = json.loads((SCHEMA_EXAMPLES / "stop.json").read_text())


def test_a_request_after_the_code_changed_gets_409_runs_nothing_and_the_server_releases_its_files(changing_code_server):
    story, code_file, task_listing = changing_code_server
    code_file.write_text("x = 22\n")
    story.expect_stale_answer_released_files('task make "Fourth" --environment main', task_listing)


def test_a_stale_server_leaves_the_restart_mark_before_it_answers_and_the_next_server_removes_it(changing_code_server):
    story, code_file, task_listing = changing_code_server
    code_file.write_text("x = 22\n")
    story.expect_stale_answer_released_files('task make "Fourth" --environment main', task_listing)
    restart_mark = ServerFiles(story.story.home).restart_mark
    expect_exists_version_four(restart_mark)
    with ServerProcess(story.story.home) as server:
        server.expect_health()
        expect_absent_exists_version_four(restart_mark)


def test_a_server_that_starts_on_changed_code_syncs_before_it_takes_a_request(new_story):
    story = new_story(fixture=ThreeTasks)
    database = story.container.get(Database)
    database.connection.execute("UPDATE registry SET fingerprint = 'older code'")
    database.connection.commit()
    with ServerProcess(story.home) as server:
        server.expect_health()
    story.expect_rows(RegistryTable(database).row()["fingerprint"] != "older code")


def test_a_server_syncs_when_its_old_registry_binds_a_class_that_is_gone(new_story):
    story = new_story(fixture=ThreeTasks)
    database = story.container.get(Database)
    database.connection.execute("UPDATE registry SET fingerprint = 'older code', entries = json_set(entries, '$.bindings.\"core.gone:Interface\"', 'core.gone:Gone')")
    database.connection.commit()
    with ServerProcess(story.home) as server:
        server.expect_health()
    story.expect_rows(RegistryTable(database).row()["fingerprint"] != "older code")
    expect_entries_registry_table_without(database, "core.gone")


def test_a_hook_on_code_newer_than_the_registry_goes_through_unchecked_and_a_stop_is_held(new_story):
    story = new_story(fixture=ThreeTasks)
    database = story.container.get(Database)
    database.connection.execute("UPDATE registry SET fingerprint = 'older code'")
    database.connection.commit()
    with server_story(story) as served:
        served.expect_hook_answer("/hook", SCHEMA_EDIT, 200, "the journal let this through unchecked: the journal's modules changed")
        served.expect_hook_answer("/hook", SCHEMA_STOP, 200, "the journal could not check this stop and holds it")


def test_a_stop_request_is_answered_and_the_server_stops(task_server):
    story = task_server
    story.expect_stop()


def test_a_server_process_stopped_by_sigterm_removes_its_socket_and_pid_file_and_lets_the_lock_go(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_sigterm_stop()


def test_a_second_server_process_beside_a_running_one_exits_at_once(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_second_server_exits()


def test_a_stop_ends_the_server_at_once_while_a_client_still_holds_its_connection_open(new_story):
    with ServerProcess(new_story(fixture=ThreeTasks).home) as server:
        server.expect_health()
        server.expect_idle_connection_stop()



def test_a_server_that_starts_past_the_log_limit_leaves_a_small_log_and_one_old_file(new_story):
    home = new_story(fixture=ThreeTasks).home
    log = ServerFiles(home).log
    log.parent.mkdir(parents=True, exist_ok=True)
    old_log = log.with_name("server.log.1")
    for size in (LOG_LIMIT_BYTES + 1, LOG_LIMIT_BYTES + 2):
        log.write_text("x" * size)
        with ServerProcess(home, logged=True) as server:
            server.expect_health()
        expect_st_size_stat(old_log, size)
        expect_st_size_stat_less(log, LOG_LIMIT_BYTES // 100)
        expect_changed_with(log, "listening on")
        expect_absent_exists_with_log(log, "server.log.2")




@pytest.fixture
def changing_code_server(new_story, tmp_path):
    code_file = tmp_path / "code" / "a.py"
    code_file.parent.mkdir()
    code_file.write_text("x = 1\n")
    with server_story(new_story(fixture=ThreeTasks), SampleCodeFolders([code_file.parent])) as story:
        yield story, code_file, story.story.run("task list --environment main")


def expect_st_size_stat(old_log, expected) -> None:
    actual = old_log.stat().st_size
    assert actual == expected, actual


def expect_st_size_stat_less(log, expected) -> None:
    actual = log.stat().st_size
    assert actual < expected, actual


def expect_entries_registry_table_without(database, expected) -> None:
    actual = RegistryTable(database).row()['entries']
    assert expected not in actual, actual
