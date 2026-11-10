from core.modules.docking.ticks.dock_item_leaves import DockItemLeaves
import pytest

from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.database.database import Database
from core.base.registry.registry import Registry
from core.modules.docking.commands.keep_dock_item.keep_dock_item import KeepDockItem
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.run_visibility import RunVisibility
from core.modules.processes.queries.process_query import ProcessQuery
from tests.stories.core.modules.chat.support.mark_samples import mark_count, expect_mark_count
from core.modules.processes.commands.move_process.move_process import MoveProcess
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, monitor, moved_run, parts_started, start_process, started_run, tick
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row

MARKS = "chat-mark list --environment 1 --oldest"
AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
PROGRESS = 'reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"'


def test_the_readers_progress_is_the_marks_figure_updated_in_place(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run(PROGRESS, actor=story.agent)
    process = started_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    starting_count = mark_count(story)
    story.container.get(OutputFolder).write_output(process.id, 1, "building\n[ 40%]\n")
    tick(story)
    story.run_listeners()
    expect_mark_count(story, starting_count)
    story.expect_text(MARKS, "40%")
    story.container.get(OutputFolder).write_output(process.id, 1, "building\n[ 40%]\n[ 80%]\n")
    tick(story)
    story.run_listeners()
    expect_mark_count(story, starting_count)
    story.expect_text(MARKS, "80%")


def test_the_steps_a_reader_counts_move_the_mark_of_a_run_that_has_no_progress_figure(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add steps --commands "make*" --lines "FAILED" --step "[.F]"', actor=story.agent)
    process = started_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    starting_count = mark_count(story)
    story.container.get(OutputFolder).write_output(process.id, 1, "..\n")
    tick(story)
    story.run_listeners()
    story.expect_text(MARKS, "2 passed")
    story.container.get(OutputFolder).write_output(process.id, 1, "..\n..\n")
    tick(story)
    story.run_listeners()
    expect_mark_count(story, starting_count)
    story.expect_text(MARKS, "4 passed")


def test_a_mark_of_a_stopped_run_says_the_agent_stopped_it_and_not_its_last_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.container.get(OutputFolder).write_output(process.id, 1, "[ 1%]\n")
    story.expect_success(f"output stop {process.id}", actor=story.agent)
    story.run_listeners()
    story.expect_text(f"{MARKS} --json", "The agent stopped it")
    story.expect_absent(f"{MARKS} --json", "[ 1%]")


def test_a_mark_of_a_run_a_person_stopped_says_so(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "make test", category=CommandCategory.TEST_RUN)
    story.expect_success(f"output stop {process.id}", actor=story.user)
    story.run_listeners()
    story.expect_text(f"{MARKS} --json", "You stopped it")


def test_the_end_of_a_run_ends_its_mark_with_the_outcome_by_its_exit_code(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    passing, failing = started_run(story, "make one", category=CommandCategory.BUILD), started_run(story, "make two", category=CommandCategory.BUILD)
    end_run(story, passing, "ok\n")
    end_run(story, failing, "boom\n", exit_code=2)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --outcome passed", "process:1")
    story.expect_text("chat-mark list --environment 1 --outcome failed", "process:2")
    story.expect_text("chat-mark list --environment 1 --state ended", "process:1", "process:2")


def test_a_short_run_whose_output_is_dropped_still_ends_its_mark(ended_short_mark):
    story, process = ended_short_mark
    story.expect_text(MARKS, "process:1")
    end_run(story, process, "ok\n")
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --state ended", "process:1")


def test_the_mark_is_a_process_mark_that_folds_open_in_place_and_has_a_stop_and_a_dock_button(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "processes.command")
    expect_row(mark, family="processes.commands", family_title="Commands", group="work", click="unfold", process=True)
    expect_label_button_runs(mark, [("Stop", "output stop {row_id}"), ("Dock", "dock add processes.output process {row_id}")])


def test_a_finished_process_cannot_be_docked_and_stop_and_dock_are_only_for_a_running_one(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "make done")
    end_run(story, process, "a\n")
    story.expect_refusal(f"dock add processes.output process {process.id} --environment main", "has ended, so it cannot be docked", actor=story.agent)
    mark = next(entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == "processes.command")
    expect_variants_button_buttons(mark, [["queued", "running", "background"], ["running", "background"]])


def test_a_docked_output_leaves_10_seconds_after_its_process_ends_unless_kept(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    kept, leaving = started_run(story, "make kept", category=CommandCategory.BUILD), started_run(story, "make leaving", category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=6))
    story.tick("s-1")
    story.run_listeners()
    story.expect_text("dock-item list --oldest", "processes.output")
    story.container.get(Bus).run(KeepDockItem(1), user)
    end_run(story, kept, "a\n")
    end_run(story, leaving, "b\n")
    story.advance(timedelta(seconds=11))
    story.run_listeners()
    DockItemLeaves()(story.container)
    story.expect_text("dock-item show 1", "state: docked")
    story.expect_text("dock-item show 2", "state: undocked")


def test_a_plain_command_that_ends_well_in_the_foreground_makes_no_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "cat notes")
    end_run(story, process, "text\n")
    story.run_listeners()
    expect_mark_count(story, 0)


def test_a_failed_plain_command_makes_no_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "cat notes")
    end_run(story, process, "no such file\n", exit_code=1)
    story.run_listeners()
    expect_mark_count(story, 0)


def test_a_plain_command_moved_to_the_background_makes_no_mark(background_plain_mark):
    story, process = background_plain_mark
    expect_mark_count(story, 0)


def test_a_part_that_never_ran_has_no_file_and_the_output_before_it_is_read_all_the_same(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "make one && make two")
    folder = story.container.get(OutputFolder)
    folder.write_output(process.id, 1, "ran\n")
    expect_bytes_after_folder(folder, process, 0, b"ran\n")
    expect_bytes_after_folder(folder, process, 2, b"n\n")


def test_a_run_past_5_seconds_docks_its_output_once_and_a_short_one_does_not(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    started_run(story, "make build", category=CommandCategory.BUILD)
    story.tick("s-1")
    story.run_listeners()
    story.expect_absent("dock-item list", "processes.output")
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    story.expect_text("dock-item show 1", "state: docked")
    story.expect_refusal("dock-item show 2", "no dock-item 2")


def test_visibility_and_the_long_run_dock_agree(process_story):
    story = process_story
    cases = [("journal worker merge 7", True), ("Journal worker merge 7", False),
             ("journal worker_merGe 7", False), ("make build", True)]
    processes = [(started_run(story, line, category=CommandCategory.BUILD if line == "make build" else CommandCategory.UNKNOWN), visible) for line, visible in cases]
    story.advance(timedelta(seconds=6))
    candidates = {process.id for process in story.container.get(ProcessQuery).running().long_run_candidates(story.clock.timestamp(), 5).all_rows()}
    visibility = story.container.get(RunVisibility)
    expect_visible_visibility_id(visibility, candidates, processes, [(visible, visible) for _, visible in processes])
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    story.expect_text("dock-item list", "processes.output")


@pytest.fixture
def process_story(new_story):
    return install_runner(new_story(fixture=BuilderStarted))


def test_a_run_that_waited_in_the_queue_docks_only_after_5_seconds_of_running(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("setting set journal.core.processes.run-batch-size 1 --environment main", actor=story.user)
    story.expect_success("setting set journal.core.processes.readers-forced false --environment main", actor=story.user)
    story.agent = Actor(story.new_row_id("agent start queue-worker claude worker --environment main"), ActorType.AGENT)
    first = started_run(story, "deploy one", category=CommandCategory.BUILD)
    second = start_process(story, "deploy two", category=CommandCategory.BUILD)
    story.run_listeners()
    story.expect_absent(MARKS, "deploy two")
    story.advance(timedelta(seconds=20))
    end_run(story, first, "built\n")
    parts_started(story, second)
    story.run_listeners()
    story.expect_text(MARKS, "Running deploy two")
    story.tick("queue-worker")
    story.run_listeners()
    story.expect_absent("dock-item list", "processes.output")
    story.advance(timedelta(seconds=6))
    story.tick("queue-worker")
    story.run_listeners()
    story.expect_text("dock-item list", "processes.output")


def test_a_watch_docks_no_run_before_5_seconds_of_running(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "make build", category=CommandCategory.BUILD)
    story.run(f"output watch {process.id}", actor=story.agent)
    story.run_listeners()
    story.expect_absent("dock-item list", "processes.output")


def test_the_chat_window_reads_a_runs_output_so_its_mark_can_open(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("messages.chat", "output peek 1 --all")


def test_a_docked_run_without_a_title_tells_the_agent_to_name_it_once(untitled_docked_run):
    story, process, wanted = untitled_docked_run
    story.expect_hook_allowed("s-1", monitor(f"journal output monitor {process.id}"), wanted)
    story.expect_absent_hook_line("s-1", HookSamples.stop(), wanted)


def test_only_a_real_long_run_docks_and_not_one_whose_folder_says_it_ended(running_docked_process):
    story, ended = running_docked_process
    story.expect_absent("dock-item list", "processes.output")


def test_when_an_agent_ends_the_runs_it_left_going_end_as_lost(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "make build", category=CommandCategory.BUILD)
    story.user_actor = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_success(f"agent end {story.agent.id}", actor=story.user_actor)
    story.run_listeners()
    story.expect_text(f"output status {process.id} --environment main", f"{process.id}  orphaned", actor=story.user_actor)


def test_an_ended_run_says_its_result_on_its_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests", category=CommandCategory.TEST_RUN)
    end_run(story, process, "F..\n=== 1 failed, 2 passed in 1.00s ===\n", exit_code=1)
    story.run_listeners()
    story.expect_text("chat-mark list --json", "1 failed, 2 passed")


@pytest.mark.parametrize("seconds, shown", [(20, "1 failed, 2 passed in 20 s"), (125, "1 failed, 2 passed in 2 min 5 s"), (120, "1 failed, 2 passed in 2 min")])
def test_an_ended_run_shows_how_long_it_took_beside_its_result(new_story, seconds, shown):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests", category=CommandCategory.TEST_RUN)
    story.advance(timedelta(seconds=seconds))
    end_run(story, process, "F..\n=== 1 failed, 2 passed in 1.00s ===\n", exit_code=1)
    story.run_listeners()
    story.expect_text("chat-mark list --json", shown)


def test_test_marks_name_the_tests_and_count(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    python = started_run(story, "pytest tests/cart.py", category=CommandCategory.TEST_RUN)
    vitest = started_run(story, "npx vitest run cart", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    story.expect_text(MARKS, "Running Python tests", "Running Vitest tests")
    story.expect_text(f"process card {python.id}", "Running Python tests")
    end_run(story, python, "collected 12 items\n12 passed\n")
    end_run(story, vitest, "cart.test.js > works\n Test Files  1 passed (1)\n      Tests  1 passed (1)\n")
    story.run_listeners()
    story.expect_text(MARKS, "Ran 12 Python tests", "Ran 1 Vitest tests")
    story.expect_text(f"process card {vitest.id}", "Ran 1 Vitest tests")


def test_go_tests_use_the_reader_title_and_count_even_when_a_pipe_returns_zero(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_success('reader add go-tests --commands "go*test*" --title "Go tests" --lines "FAIL|passed" --summary "(FAIL)" --failed "^FAIL" --count "total ([0-9]+)" --progress "([0-9]+)%"', actor=story.agent)
    process = started_run(story, "go -C tools test ./...", category=CommandCategory.TEST_RUN)
    story.run_listeners()
    story.expect_text(MARKS, "Running Go tests")
    end_run(story, process, "total 12\n100%\nFAIL\n", exit_code=0)
    story.run_listeners()
    story.expect_text("chat-mark list --environment 1 --outcome failed", "Ran 12 Go tests")


@pytest.fixture
def ended_short_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "make plain", category=CommandCategory.BUILD)
    story.run_listeners()
    return story, process


@pytest.fixture
def background_plain_mark(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = started_run(story, "grep -n cart notes")
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.run_listeners()
    end_run(story, process, "done\n")
    story.run_listeners()
    return story, process


@pytest.fixture
def untitled_docked_run(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "./deploy.sh staging", category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=6))
    wanted = f"output {process.id} has its raw command as its title: give it a title"
    return story, process, wanted


@pytest.fixture
def running_docked_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    started_run(story, "grep -n word file")
    ended = started_run(story, "make build", category=CommandCategory.BUILD)
    story.container.get(OutputFolder).write_end(ended.id, 0)
    story.advance(timedelta(seconds=6))
    story.hook("s-1", HookSamples.stop())
    story.run_listeners()
    return story, ended


def expect_visible_visibility_id(visibility, candidates, processes, expected) -> None:
    actual = [(visibility.is_visible(process), process.id in candidates) for process, _ in processes]
    assert actual == expected, actual


def expect_bytes_after_folder(folder, process, number, expected) -> None:
    actual = folder.bytes_after(process.id, number)
    assert actual == expected, actual


def expect_variants_button_buttons(mark, expected) -> None:
    actual = [button['variants'] for button in mark.buttons]
    assert actual == expected, actual


def expect_label_button_runs(mark, expected) -> None:
    actual = [(button['label'], button['runs']) for button in mark.buttons]
    assert actual == expected, actual
