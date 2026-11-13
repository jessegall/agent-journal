import json
import os
from datetime import timedelta

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.processes.commands.start_process.start_process import StartProcess
from engine.module.module_finder import ModuleFinder
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.processes.support.cadence_probe import (HelperBesideWorker, agent_run, cadence_tick, expect_informed, kept_lines, emitted_current,
                                                                       running_run, informed, tree_of, worker_agent)
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.processes.support.process_nudges import HUNG_RUN
from core.modules.processes.support.process_nudges import RUN_FROZEN

MISSING_GROUP = 999999
HANG_SECONDS = 300
CHECK_SECONDS = 900
CHECK_LINE = "processes.look"


class FakeGroupCpuTime(GroupCpuTime):
    """The CPU time of a fake process tree, which the story sets."""

    def __init__(self, seconds: float | None) -> None:
        self.used = seconds
        self.listings = 0

    def listing(self) -> str:
        self.listings += 1
        return ""

    def seconds(self, listing: str, group: int) -> float | None:
        return self.used


class ActiveBuild(StoryFixture):
    """The main agent's make build runs in the background."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        moved_run(story, "make build")


class ActiveTestRun(StoryFixture):
    """The main agent's go test runs in the background."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        moved_run(story, "go test ./...", CommandCategory.TEST_RUN)


def watch_tick(story: Story) -> None:
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "hang watch"]
    assert len(handlers) == 1, handlers
    handlers[0].handler(story.container)


def started_tree(story: Story, used: float | None) -> FakeGroupCpuTime:
    tree = FakeGroupCpuTime(used)
    story.container.bind(GroupCpuTime, tree)
    story.container.get(OutputFolder).write_pid(1, MISSING_GROUP)
    watch_tick(story)
    return tree


def test_an_idle_run_that_printed_lately_is_left_alone(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 10))
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "make build", ["make build"])
    folder.write_output(1, 1, "still alive\n")
    shown_at = story.clock.timestamp().value.timestamp() - 5
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (shown_at, shown_at))
    watch_tick(story)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_run_with_no_process_tree_is_left_alone(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, None)
    story.advance(timedelta(seconds=HANG_SECONDS + 30))
    watch_tick(story)
    story.expect_text("process card 1 --json", '"state": "background"', actor=story.agent)


def expect_looks(story: Story, requested: int) -> None:
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows(lines.count(CHECK_LINE) == requested, detail=f"{requested} asks expected in:\n{lines}")


def busy_for(story: Story, tree: FakeGroupCpuTime, seconds: int) -> None:
    story.advance(timedelta(seconds=seconds))
    tree.used += 1
    watch_tick(story)


def test_a_silent_test_run_that_keeps_using_processor_time_has_its_agent_asked_to_look_at_the_ceiling(new_story):
    story = new_story(fixture=ActiveTestRun)
    tree = started_tree(story, 12.0)
    for seconds in (400, 400):
        busy_for(story, tree, seconds)
    expect_looks(story, 0)
    busy_for(story, tree, 200)
    expect_looks(story, 1)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_silent_build_that_keeps_using_processor_time_is_never_asked_about(new_story):
    story = new_story(fixture=ActiveBuild)
    tree = started_tree(story, 12.0)
    for seconds in (500, 500, 500):
        busy_for(story, tree, seconds)
    expect_looks(story, 0)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_test_run_that_prints_again_after_the_ask_is_asked_again_only_after_it_goes_silent_again(new_story):
    story = new_story(fixture=ActiveTestRun)
    tree = started_tree(story, 12.0)
    busy_for(story, tree, CHECK_SECONDS + 5)
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "go test ./...", ["go test ./..."])
    folder.write_output(1, 1, "ok\n")
    emitted_at = story.clock.timestamp().value.timestamp()
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (emitted_at, emitted_at))
    busy_for(story, tree, HANG_SECONDS + 1)
    expect_looks(story, 1)


def test_one_listing_of_the_processes_serves_every_run_of_a_tick(new_story):
    story = new_story(fixture=ActiveBuild)
    moved_run(story, "make test")
    story.container.get(OutputFolder).write_pid(2, MISSING_GROUP)
    tree = started_tree(story, 12.0)
    tree.listings = 0
    watch_tick(story)
    story.expect_rows(tree.listings == 1)


def test_a_quiet_run_its_agent_read_is_kept_past_the_hang_time_and_stopped_once_it_goes_unread_that_long(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=200))
    story.run("output read 1 --summary", actor=story.agent)
    story.advance(timedelta(seconds=150))
    watch_tick(story)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    story.advance(timedelta(seconds=HANG_SECONDS))
    watch_tick(story)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)


class ActiveCommit(StoryFixture):
    """The main agent's journal commit command runs in the background."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        moved_run(story, "journal worker-operation run 2")


def test_a_silent_journal_command_waiting_on_its_agents_queued_run_is_never_stopped_as_hung(new_story):
    story = new_story(fixture=ActiveCommit)
    started_tree(story, 12.0)
    judge = story.container.get(Bus).run(StartProcess.single_part(story.agent.id, "pytest tests/web -q", "/work/main", CommandCategory.TEST_RUN, 30), story.agent, environment_id=1)
    story.advance(timedelta(seconds=HANG_SECONDS + 30))
    watch_tick(story)
    story.expect_rows(judge.is_queue_run)
    story.expect_text("process show 1", "state: background", actor=story.agent)


TICK = timedelta(seconds=10)
HALF = HANG_SECONDS // 2
HUNG = "uses no CPU"


def titled(story: Story, title: str, process_id: int = 1) -> None:
    story.expect_success(f'output title {process_id} "{title}"', actor=story.agent)


def watched(story: Story, seconds: int, tree: FakeGroupCpuTime | None = None) -> None:
    """Ten seconds at a time, the hang watch and then the cadence watch; a busy tree uses more CPU time each step."""
    for _ in range(seconds // TICK.seconds):
        story.advance(TICK)
        if tree is not None:
            tree.used += 1
        watch_tick(story)
        cadence_tick(story)


def hang_line(process_id: int, seconds: int = HALF) -> str:
    return RUN_FROZEN.nudge(output=process_id, seconds=seconds, limit=HANG_SECONDS).text


def hung_line(process_id: int) -> str:
    return HUNG_RUN.nudge(output=process_id, seconds=HANG_SECONDS).text


def test_a_stuck_test_run_wakes_its_agent_once_at_half_the_hang_time_and_is_stopped_at_the_hang_time(new_story):
    story = new_story(fixture=ActiveTestRun)
    titled(story, "Running the stuck tests")
    started_tree(story, 12.0)
    watched(story, HALF)
    warnings = [row for row in json.loads(kept_lines(story))["rows"] if HUNG in row["text"]]
    story.expect_rows([row["text"] for row in warnings] == [hang_line(1)], all(row["wakes_agent"] for row in warnings), detail=kept_lines(story))
    story.expect_text("process show 1", "state: background", actor=story.agent)
    watched(story, HALF)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)
    lines = kept_lines(story)
    story.expect_rows(lines.count(HUNG) == 1, hung_line(1) in lines, detail=lines)


def test_a_helpers_and_a_workers_stuck_runs_wake_them_with_the_same_warning(new_story):
    story = new_story(fixture=HelperBesideWorker)
    helper, worker = helper_agent(story), worker_agent(story)
    runs = (agent_run(story, helper, "npm test", CommandCategory.TEST_RUN), agent_run(story, worker, "make build", CommandCategory.BUILD))
    tree_of(story, FakeGroupCpuTime(12.0), MISSING_GROUP, *runs)
    watch_tick(story)
    watched(story, HALF)
    expect_informed(story, helper.session, hang_line(runs[0].id))
    expect_informed(story, worker.session, hang_line(runs[1].id))


def test_a_busy_silent_test_run_gets_no_stuck_warning_and_is_still_asked_to_be_looked_at(new_story):
    story = new_story(fixture=ActiveTestRun)
    titled(story, "Running the busy tests")
    tree = started_tree(story, 12.0)
    watched(story, CHECK_SECONDS + 100, tree)
    story.expect_rows(HUNG not in kept_lines(story), detail=kept_lines(story))
    expect_looks(story, 1)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_stuck_build_test_run_check_and_python_run_are_warned_alike(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    runs = [moved_run(story, line, category) for line, category in (("make build", CommandCategory.BUILD), ("pytest -q", CommandCategory.TEST_RUN),
                                                                     ("make lint", CommandCategory.CHECK), ("python3 tools/sync.py", CommandCategory.PROCESS))]
    titled(story, "Building the project", runs[0].id)
    tree_of(story, FakeGroupCpuTime(12.0), MISSING_GROUP, *runs)
    watch_tick(story)
    watched(story, HALF)
    outputs = ", ".join(str(process.id) for process in runs)
    received = informed(story, "s-1") + informed(story, "s-1")
    story.expect_rows(any(f"Output {outputs} printed nothing for {HALF}s and uses no CPU" in line for line in received), detail="\n".join(received))


def test_reading_a_stuck_run_after_the_warning_starts_the_hold_anew_and_the_stop_still_follows(new_story):
    story = new_story(fixture=ActiveTestRun)
    titled(story, "Running the frozen tests")
    started_tree(story, 12.0)
    watched(story, HALF)
    story.expect_success("output read 1 --tail 5", actor=story.agent)
    watched(story, HALF)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    watched(story, HALF)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)
    expect_informed(story, "s-1", hung_line(1))


def test_a_stuck_build_that_prints_again_is_warned_again_after_a_new_silence(new_story):
    story = new_story(fixture=ActiveBuild)
    titled(story, "Building the stuck project")
    started_tree(story, 12.0)
    watched(story, HALF)
    first = informed(story, "s-1")
    emitted_current(story, running_run(story), "linking\n")
    watched(story, HALF + TICK.seconds)
    second = informed(story, "s-1")
    story.expect_rows(any(hang_line(1) in line for line in first), any(HUNG in line for line in second), detail="\n".join(first + second))


def test_a_run_with_no_known_process_tree_is_never_warned_or_stopped_but_still_told_it_does_not_stream(new_story):
    story = new_story(fixture=ActiveBuild)
    titled(story, "Building without a tree")
    started_tree(story, None)
    watched(story, HANG_SECONDS + 30)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    lines = kept_lines(story)
    story.expect_rows(HUNG not in lines, "Output 1 printed nothing for 30s" in lines, detail=lines)


def test_a_chain_whose_test_part_is_stuck_is_warned_once_for_its_output(new_story):
    story = new_story(fixture=BuilderStarted)
    process = moved_run(story, "make build && pytest -q")
    story.expect_success(f"process part-end {process.id} --position 1 --exit-code 0", actor=story.agent)
    started_tree(story, 12.0)
    watched(story, HALF + 2 * TICK.seconds)
    lines = kept_lines(story)
    story.expect_rows(lines.count(HUNG) == 1, hang_line(process.id) in lines, detail=lines)
