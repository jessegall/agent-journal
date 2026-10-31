from core.base.command.bus import Bus
from core.modules.processes.commands.end_process import EndProcess
from core.modules.processes.commands.end_process_part import EndProcessPart
from core.modules.processes.commands.move_process import MoveProcess
from core.modules.processes.commands.stop_process import StopProcess
from core.modules.processes.commands.lose_process import LoseProcess
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, BYTES_SHORT, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

PROCESS = "process show 1"
PARTS = "process-part list --process 1 --oldest"
OUTPUTS = "output list --process 1"


def bus(story) -> Bus:
    return story.container.get(Bus)


def test_starting_a_process_makes_it_running_with_one_part_for_each_command_of_its_line(new_story):
    story = new_story(fixture=BuilderStarted)
    started = start_process(story)
    assert started.id == 1
    story.expect_success(PROCESS, "state: running", "line: make test && echo done", "limit_seconds: 30")
    story.expect_ordered_lines(PARTS, "make test", "echo done")
    story.expect_text(PARTS, "waiting")


def test_a_part_ends_with_its_exit_code(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    bus(story).run(EndProcessPart(1, 1, 0), story.agent, environment_id=1)
    bus(story).run(EndProcessPart(1, 2, 3), story.agent, environment_id=1)
    story.expect_ordered_lines(PARTS, "finished", "failed")


def test_a_running_process_moves_to_the_background_and_a_background_one_cannot_move_again(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    bus(story).run(MoveProcess(1), story.agent, environment_id=1)
    story.expect_success(PROCESS, "state: background")
    story.expect_text("process show 1", "moved_at: 2")
    story.expect_refusal("process background 1", "background")


def test_a_process_ends_finished_on_exit_code_0_and_failed_on_another(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    start_process(story, "make build")
    bus(story).run(EndProcess(1, 0, BYTES_SHORT, 1), story.agent, environment_id=1)
    bus(story).run(EndProcess(2, 2, BYTES_SHORT, 1), story.agent, environment_id=1)
    story.expect_success(PROCESS, "state: finished", "exit_code: 0")
    story.expect_success("process show 2", "state: failed", "exit_code: 2")


def test_a_process_stopped_or_lost_ends_so_and_a_process_that_ended_does_not_end_twice(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    start_process(story, "make build")
    bus(story).run(StopProcess(1), story.agent, environment_id=1)
    bus(story).run(LoseProcess(2), story.agent, environment_id=1)
    story.expect_success(PROCESS, "state: stopped")
    story.expect_success("process show 2", "state: lost")
    story.expect_refusal("output stop 1", "stopped", actor=story.agent)


def test_the_end_of_a_long_run_keeps_its_output_and_a_short_one_keeps_none(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    start_process(story, "make build")
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    bus(story).run(EndProcess(2, 0, BYTES_SHORT, 1), story.agent, environment_id=1)
    story.expect_text(OUTPUTS, "kept")
    story.expect_success("output show 1", "process_id: 1", f"byte_count: {BYTES_LONG}", "line_count: 80", "state: kept")
    story.expect_text("output list --process 2", "nothing found")


def test_a_short_output_of_a_piped_line_is_kept(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story, "make test && echo done", piped=True)
    bus(story).run(EndProcess(1, 0, BYTES_SHORT, 1), story.agent, environment_id=1)
    story.expect_text(OUTPUTS, "kept")


def test_an_output_is_pruned_once(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    story.run("output prune 1", actor=story.agent)
    story.expect_success("output show 1", "state: pruned")
    story.expect_refusal("output prune 1", "pruned")


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
    story.run("process delete 1", actor=story.agent)
    story.expect_text(PARTS, "nothing found")
