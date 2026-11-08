import os
from datetime import timedelta

from core.base.module.module_finder import ModuleFinder
from core.modules.processes.support.group_cpu_time import GroupCpuTime
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

NO_SUCH_GROUP = 999999
HANG_SECONDS = 300


class FakeGroupCpuTime(GroupCpuTime):
    """The processor time of a fake process tree, which the story sets."""

    def __init__(self, seconds: float | None) -> None:
        self.used = seconds

    def seconds(self, group: int) -> float | None:
        return self.used


class RunningBuild(StoryFixture):
    """The main agent's make build runs in the background."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        moved_run(story, "make build")


def watch_tick(story: Story) -> None:
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "hang watch"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def started_tree(story: Story, used: float | None) -> FakeGroupCpuTime:
    tree = FakeGroupCpuTime(used)
    story.container.bind(GroupCpuTime, tree)
    story.container.get(OutputFolder).write_pid(1, NO_SUCH_GROUP)
    watch_tick(story)
    return tree


def test_an_idle_silent_run_is_stopped_and_its_agent_told_which_run_and_for_how_long(new_story):
    story = new_story(fixture=RunningBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    watch_tick(story)
    story.expect_text("process show 1", "state: stopped", actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "output 1 printed nothing and used no processor time for 301 seconds, so it was stopped: its output is kept", actor=story.agent)


def test_a_silent_run_whose_processor_time_rises_is_left_alone(new_story):
    story = new_story(fixture=RunningBuild)
    tree = started_tree(story, 12.0)
    for used in (13.0, 14.0):
        story.advance(timedelta(seconds=200))
        tree.used = used
        watch_tick(story)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_an_idle_run_that_printed_lately_is_left_alone(new_story):
    story = new_story(fixture=RunningBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 10))
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "make build", ["make build"])
    folder.write_output(1, 1, "still alive\n")
    printed_at = story.clock.timestamp().value.timestamp() - 5
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (printed_at, printed_at))
    watch_tick(story)
    story.expect_text("process show 1", "state: background", actor=story.agent)


def test_a_run_with_no_process_tree_is_left_alone(new_story):
    story = new_story(fixture=RunningBuild)
    started_tree(story, None)
    story.advance(timedelta(seconds=HANG_SECONDS + 30))
    watch_tick(story)
    story.expect_text("process show 1", "state: background", actor=story.agent)
