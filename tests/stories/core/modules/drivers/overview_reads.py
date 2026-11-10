import shlex
from datetime import timedelta

import pytest

from engine.command.bus import Bus
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.suites.coding.modules.workers.support.git_repository import GitRepository
from tests.stories.core.support.coding_fixtures import BriefedTaskBuilder, UnreadTaskBuilder, UserBuilder

REFUSAL = "you read this overview already and it is still in your context"
COMPACTION = HookSamples.sample("compact")
CLEAR = HookSamples.session_start().with_raw({"source": "clear"})
OVERVIEW_LINES = ("task overview 1", "overview", "git-overview commits --environment main")


class TwoOpenTasks(StoryFixture):
    """Tasks 1 and 2 are open and nobody holds them."""

    parent = BriefedTaskBuilder

    def steps(self, story: Story) -> None:
        story.run('task make "Second" --brief "a second job" --environment main', actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_text("task show 2", "title: Second", actor=story.agent)


class CheckedOutRepository(StoryFixture):
    """Task 1 is open and environment main has a folder whose git branch holds two commits."""

    parent = TwoOpenTasks

    def steps(self, story: Story) -> None:
        repository = GitRepository.sample(story.home.folder.parent / "repository")
        repository.checkout("version-5")
        story.run(f"environment edit 1 --folder {shlex.quote(str(repository.folder))}", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_text("git-overview current --environment main", "version-5", actor=story.user)


class TaskOneRead(StoryFixture):
    """The main agent ran the overview of task 1."""

    parent = TwoOpenTasks

    def steps(self, story: Story) -> None:
        story.run("task overview 1", actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_refusal("task overview 1", REFUSAL, actor=story.agent)


class EveryOverviewRead(StoryFixture):
    """The main agent ran every overview once, a second ago."""

    parent = CheckedOutRepository

    def steps(self, story: Story) -> None:
        read_overviews(story)
        story.advance(timedelta(seconds=1))

    def expect(self, story: Story) -> None:
        story.expect_refusal("overview", REFUSAL, actor=story.agent)


def read_overviews(story: Story) -> None:
    for line in OVERVIEW_LINES:
        story.expect_success(line, actor=story.agent)


def test_a_second_overview_of_the_same_task_is_refused(new_story):
    story = new_story(fixture=TaskOneRead)
    story.expect_refusal("task overview 1", REFUSAL, actor=story.agent)


def test_the_overview_of_another_task_passes(new_story):
    story = new_story(fixture=TaskOneRead)
    story.expect_text("task overview 2", "task 2: Second", actor=story.agent)


def test_the_overview_of_the_journal_is_refused_the_second_time(new_story):
    story = new_story(fixture=TwoOpenTasks)
    story.expect_success("overview", actor=story.agent)
    story.expect_refusal("overview", REFUSAL, actor=story.agent)


def test_a_git_overview_page_is_refused_the_second_time_and_another_page_passes(new_story):
    story = new_story(fixture=CheckedOutRepository)
    story.expect_text("git-overview commits --limit 1 --environment main", "The cart", actor=story.agent)
    story.expect_refusal("git-overview commits --limit 1 --environment main", REFUSAL, actor=story.agent)
    story.expect_text("git-overview commits --skip 1 --limit 1 --environment main", "The first commit", actor=story.agent)


@pytest.mark.parametrize("reset", [COMPACTION, CLEAR], ids=["compaction", "clear"])
def test_every_overview_passes_again_after_a_context_reset(new_story, reset):
    story = new_story(fixture=EveryOverviewRead)
    story.hook("s-1", reset)
    story.advance(timedelta(seconds=1))
    read_overviews(story)


def test_a_failed_read_does_not_count_as_a_read(new_story):
    story = new_story(fixture=TwoOpenTasks)
    story.expect_refusal("task overview 3", "no task 3", actor=story.agent)
    story.run('task make "Third" --brief "a third job" --environment main', actor=story.agent)
    story.expect_text("task overview 3", "task 3: Third", actor=story.agent)


def test_a_task_handed_back_for_rework_can_be_read_again_in_the_same_window(new_story):
    story = new_story(fixture=UnreadTaskBuilder)
    story.container.get(TaskBriefRequirement).is_required = True
    story.expect_text("task overview 1", "task 1: Fix the cart", actor=story.agent)
    story.expect_refusal("task overview 1", REFUSAL, actor=story.agent)
    story.container.get(Bus).run(ResetTaskReads(story.agent.id), story.agent, environment_id=1)
    story.expect_text("task overview 1", "task 1: Fix the cart", actor=story.agent)


def test_a_person_is_never_refused(new_story):
    story = new_story(fixture=CheckedOutRepository)
    for line in OVERVIEW_LINES:
        story.expect_success(line, actor=story.user)
        story.expect_success(line, actor=story.user)
