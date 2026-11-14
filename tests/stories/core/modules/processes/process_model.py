
from engine.command.bus import Bus
from core.modules.processes.commands.end_process.end_process import EndProcess
from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, BYTES_SHORT, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted
from engine.testing.expectations.expect_row import expect_row

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


def test_the_parts_of_a_process_go_with_it(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    story.expect_text(PARTS, "make test")
    bus(story).run(EndProcess(1, 0, BYTES_LONG, 80), story.agent, environment_id=1)
    story.run("process delete 1", actor=story.agent)
    story.expect_text(PARTS, "nothing found")
