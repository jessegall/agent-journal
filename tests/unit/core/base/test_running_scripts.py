import subprocess

import pytest

from core.base.caller.process_row import ProcessRow
from core.base.database.database import Database
from engine.container.journal_container import database_container
from engine.journal.journal_home import JournalHome
from core.base.model.event_form import EventForm
from core.base.plugin_script_processes import PluginScriptProcesses
from engine.time.timestamp import Timestamp

STARTED_AT = Timestamp.parsed("2026-11-06T09:00:00+00:00")
KEY = "core.tasks.task.created"
WAIT_SECONDS = 10


@pytest.fixture
def waiting_process():
    process = subprocess.Popen(["cat"], stdin=subprocess.PIPE, text=True, start_new_session=True)
    yield process
    process.kill()
    process.communicate()


def process_row(pid: int, parent_pid: int = 1) -> ProcessRow:
    return ProcessRow(pid, parent_pid, STARTED_AT)


def test_two_containers_on_one_home_see_one_script(tmp_path, waiting_process):
    home = JournalHome(tmp_path / "journal")
    home.folder.mkdir()
    first, second = database_container(home, Database.opened(home)), database_container(home, Database.opened(home))
    first.get(PluginScriptProcesses).start(waiting_process, "events", KEY, EventForm.GUARD, STARTED_AT)
    assert second.get(PluginScriptProcesses).owner([process_row(waiting_process.pid)]) == "events"
    first.get(Database).close()
    second.get(Database).close()


def test_two_homes_keep_their_scripts_apart(tmp_path, waiting_process):
    PluginScriptProcesses.shared(JournalHome(tmp_path / "one")).start(waiting_process, "events", KEY, EventForm.GUARD, STARTED_AT)
    assert PluginScriptProcesses.shared(JournalHome(tmp_path / "two")).owner([process_row(waiting_process.pid)]) == ""


def test_the_owner_is_found_anywhere_in_the_chain_and_a_finished_script_owns_nothing(waiting_process):
    scripts = PluginScriptProcesses()
    scripts.start(waiting_process, "events", KEY, EventForm.LISTEN, STARTED_AT)
    chain = [process_row(4000, waiting_process.pid), process_row(waiting_process.pid, 1)]
    assert scripts.owner(chain) == "events"
    scripts.finish(waiting_process)
    assert scripts.owner(chain) == ""


def test_running_lists_the_scripts_of_one_plugin(waiting_process):
    scripts = PluginScriptProcesses()
    scripts.start(waiting_process, "events", KEY, EventForm.COMMIT, STARTED_AT)
    assert [script.key for script in scripts.running("events")] == [KEY]
    assert scripts.running("other") == ()


def test_stop_ends_the_process_group_of_that_plugin_only(waiting_process):
    scripts = PluginScriptProcesses()
    scripts.start(waiting_process, "events", KEY, EventForm.GUARD, STARTED_AT)
    scripts.stop("other")
    assert waiting_process.poll() is None
    scripts.stop("events")
    assert waiting_process.wait(timeout=WAIT_SECONDS) != 0


def test_stop_all_ends_every_running_script(waiting_process):
    scripts = PluginScriptProcesses()
    scripts.start(waiting_process, "events", KEY, EventForm.COMMIT, STARTED_AT)
    scripts.stop_all()
    assert waiting_process.wait(timeout=WAIT_SECONDS) != 0


def test_a_service_of_a_plugin_owns_the_line_like_a_script():
    scripts = PluginScriptProcesses()
    scripts.keep_services({5000: "served"})
    assert scripts.owner([process_row(5001, 5000), process_row(5000, 1)]) == "served"
    scripts.keep_services({})
    assert scripts.owner([process_row(5000, 1)]) == ""
