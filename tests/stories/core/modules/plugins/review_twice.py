from unittest.mock import Mock

import pytest

from core.base.command.bus import Bus
from core.base.refusal import Refusal
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.support.process_group import ProcessGroup
from tests.stories.core.modules.plugins.support.refusing_modules import REFUSING, DeleteProcessRow, OrphanProcessRow
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
