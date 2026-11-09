from unittest.mock import Mock

import pytest

from core.base.command.bus import Bus
from engine.errors.refusal import Refusal
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_group import ProcessGroup
from tests.stories.core.modules.plugins.support.refusing_modules import REFUSING, DeleteProcessRow, SlotsCreateNote, OrphanProcessRow
from tests.stories.core.modules.plugins.support.event_modules import NOTE_CREATED, NOTES, EventNote
from tests.stories.core.modules.plugins.support.checkout_stories import ORDER, project_with_order
from tests.stories.core.modules.plugins.support.event_stories import EventWorkerStarted, event_data, event_plugin_story, script_calls
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.core.modules.processes.support.process_samples import ended_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted


def process_folder(story, process):
    return story.home.folder / "processes" / str(process.id)


@pytest.fixture
def refusing_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_sync_success(REFUSING)
    return story


def test_s83_a_refusal_after_a_command_deletes_a_process_leaves_its_folder(refusing_story):
    story = refusing_story
    process = ended_run(story, "make build", "done")
    bus = story.container.get(Bus)
    with pytest.raises(Refusal):
        bus.run(DeleteProcessRow(process.id, True), story.agent)
    story.run_listeners()
    story.expect_rows(process_folder(story, process).is_dir(), story.container.get(Queries).query(Process).filter(id=process.id).exists())
    bus.run(DeleteProcessRow(process.id, False), story.agent)
    story.expect_rows(process_folder(story, process).is_dir())
    story.run_listeners()
    story.expect_rows(not process_folder(story, process).exists())


def test_s83_a_refusal_after_a_command_orphans_a_process_leaves_it_running(refusing_story):
    story = refusing_story
    process = moved_run(story)
    group = Mock(spec=ProcessGroup)
    story.container.bind(ProcessGroup, group)
    bus = story.container.get(Bus)
    with pytest.raises(Refusal):
        bus.run(OrphanProcessRow(process.id, True), story.agent)
    story.expect_no_text(f"process show {process.id}", "state: orphaned", actor=story.agent)
    story.run_listeners()
    group.stop.assert_not_called()
    bus.run(OrphanProcessRow(process.id, False), story.agent)
    group.stop.assert_not_called()
    story.run_listeners()
    group.stop.assert_called_once()


def test_s84_a_key_after_a_command_that_runs_once_runs_no_guard_script_and_the_skip_is_noted(new_story):
    story = event_plugin_story(new_story, {"event": NOTE_CREATED, "guard": "see.sh"}, modules=[NOTES, REFUSING])
    story.container.get(Bus).run(SlotsCreateNote("A note"), story.agent)
    story.expect_rows(not script_calls(story, "see.sh"), "were skipped" in story.system_log_text(), story.container.get(Queries).query(EventNote).count() == 1)


def test_s85_a_file_edit_in_the_main_checkout_gives_its_status_and_whether_base_holds_it(new_story):
    story = main_checkout_story(new_story)
    (story.repository.folder / "new.py").write_text("TOTAL = 1\n")
    (story.repository.folder / ORDER).unlink()
    scanned_edit(story, "s-1", "new.py", existed=False, folder=story.repository.folder)
    scanned_edit(story, "s-1", ORDER, folder=story.repository.folder)
    story.run_listeners()
    files = {event_data(call)["file"]["relative"]: event_data(call)["file"] for call in script_calls(story, "see.sh")}
    story.expect_rows(files["new.py"]["status"] == "added", files["new.py"]["in_base"] is False, files[ORDER]["status"] == "deleted", files[ORDER]["in_base"] is True)


def main_checkout_story(new_story):
    story = install_runner(event_plugin_story(new_story, program="see.sh", hears=["file_edited"], fixture=EventWorkerStarted))
    story.repository = project_with_order(story, story.home.folder.parent / "project")
    story.repository.checkout(ENVIRONMENT_BRANCH)
    return story
