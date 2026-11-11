import os
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.module.module_finder import ModuleFinder
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

MISSING_GROUP = 999999
HANG_SECONDS = 300
LOOK_SECONDS = 900
LOOK_LINE = "processes.look"


class FakeGroupCpuTime(GroupCpuTime):
    """The processor time of a fake process tree, which the story sets."""

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
    story.expect_rows(len(handlers) == 1)
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


def expect_looks(story: Story, asked: int) -> None:
    lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.agent).output_text
    story.expect_rows(lines.count(LOOK_LINE) == asked, detail=f"{asked} asks expected in:\n{lines}")


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
    busy_for(story, tree, LOOK_SECONDS + 5)
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "go test ./...", ["go test ./..."])
    folder.write_output(1, 1, "ok\n")
    printed_at = story.clock.timestamp().value.timestamp()
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (printed_at, printed_at))
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
