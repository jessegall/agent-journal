import pytest

from core.base.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.commands.orphan_process.orphan_process import OrphanProcess
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, BYTES_SHORT, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.testing.expect_row import expect_row

PROCESS = "process show 1"
PARTS = "process-part list --process 1 --oldest"
OUTPUTS = "output list --process 1"


def bus(story) -> Bus:
    return story.container.get(Bus)


def test_starting_a_process_makes_it_running_with_one_part_for_each_command_of_its_line(new_story):
    story = new_story(fixture=BuilderStarted)
    started = start_process(story)
    expect_row(started, id=1)
    story.expect_success(PROCESS, "state: running", "line: make test && echo done", "limit_seconds: 30")
    story.expect_ordered_lines(PARTS, "make test", "echo done")
    story.expect_text(PARTS, "waiting")


def test_a_running_process_moves_to_the_background_and_a_background_one_cannot_move_again(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    bus(story).run(MoveProcess(1), story.agent, environment_id=1)
    story.expect_success(PROCESS, "state: background")
    story.expect_text("process show 1", "moved_at: 2")
    story.expect_refusal("process background 1", "background")


def test_a_process_stopped_or_lost_ends_so_and_a_process_that_ended_does_not_end_twice(stopped_process_states):
    story = stopped_process_states
    story.expect_success("process show 2", "state: orphaned")
    story.expect_refusal("output stop 1", "stopped", actor=story.agent)


def test_long_and_short_runs_both_keep_their_output(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    start_process(story, "make build")
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    bus(story).run(EndProcess(2, 0, BYTES_SHORT, 1), story.agent, environment_id=1)
    story.expect_text(OUTPUTS, "kept")
    story.expect_success("output show 1", "process_id: 1", f"byte_count: {BYTES_LONG}", "line_count: 80", "state: kept")
    story.expect_text("output list --process 2", "kept")


def test_outputs_have_no_independent_prune_command(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    story.expect_absent("output --help", "prune", actor=story.agent)


def test_a_watch_ends_once(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    story.run("output watch 1", actor=story.agent)
    story.expect_success("watch show 1", "state: open", "process_id: 1")
    story.run("output unwatch 1", actor=story.agent)
    story.expect_success("watch show 1", "state: ended")
    story.expect_refusal("output unwatch 1", "no open watch", actor=story.agent)


def test_the_parts_of_a_process_go_with_it(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    story.expect_text(PARTS, "make test")
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    story.run("process delete 1", actor=story.agent)
    story.expect_text(PARTS, "nothing found")


@pytest.fixture
def started_process(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    start_process(story, "make build")
    return story


@pytest.fixture
def stopped_process_states(started_process):
    story = started_process
    bus(story).run(StopProcess(1), story.agent, environment_id=1)
    bus(story).run(OrphanProcess(2), story.agent, environment_id=1)
    story.expect_success(PROCESS, "state: stopped")
    return story
