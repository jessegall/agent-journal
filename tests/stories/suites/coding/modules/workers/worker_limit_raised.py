from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIMIT_RAISED
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from engine.testing.expectations.expect_nudge import SaidNudge, said
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder
from suites.coding.modules.workers.support.worker_settings import WORKER_BATCH_SIZE

LISTING = HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"])).with_fields(event="post_tool_use")


def story_with_person(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


def limit_lines(story) -> list[str]:
    return [line for line in story.hook("s-1", LISTING).lines if said(WORKER_LIMIT_RAISED).is_in(line)]


def set_limit(story, limit: int, scope: str = "--environment main") -> None:
    story.expect_success(f"setting set {WORKER_RUN_LIMIT} {limit} {scope}", actor=story.user)


class LimitRaised(StoryFixture):
    """A user, Ada, raised the worker limit of main to 4: story.user."""

    parent = OpenTaskBuilder

    def steps(self, story) -> None:
        story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
        set_limit(story, 4)

    def expect(self, story) -> None:
        story.expect_text(f"setting show {WORKER_RUN_LIMIT} --environment main", "4")


def test_raising_the_worker_limit_tells_the_main_agent_the_limit_the_workers_out_and_the_open_tasks_not_delegated(new_story):
    story = story_with_person(new_story)
    story.run('task make "Fix the footer" --environment main', actor=story.agent)
    set_limit(story, 4)
    expect_limit_lines(story, [said(WORKER_LIMIT_RAISED, limit=4, workers=0, count=2)])


def test_the_line_comes_once(new_story):
    story = new_story(fixture=LimitRaised)
    expect_limit_lines_2(story, 1)
    expect_limit_lines(story, [])


def test_lowering_the_worker_limit_tells_nothing(new_story):
    story = new_story(fixture=LimitRaised)
    limit_lines(story)
    set_limit(story, 3)
    expect_limit_lines(story, [])


def test_a_project_wide_limit_raised_tells_the_main_agent_of_each_environment(new_story):
    story = story_with_person(new_story)
    set_limit(story, 5, "--project")
    expect_limit_lines(story, [said(WORKER_LIMIT_RAISED, limit=5, workers=0, count=1)])


def test_a_task_a_worker_holds_is_not_counted_as_open_and_not_delegated(new_story):
    story = story_with_person(new_story)
    story.run("task start 1", actor=story.agent)
    set_limit(story, 4)
    expect_limit_lines(story, [said(WORKER_LIMIT_RAISED, limit=4, workers=0, count=0)])


def test_another_setting_changing_tells_nothing(new_story):
    story = story_with_person(new_story)
    story.expect_success(f"setting set {WORKER_BATCH_SIZE} 5 --environment main", actor=story.user)
    expect_limit_lines(story, [])


def expect_limit_lines(story, expected: list[SaidNudge]) -> None:
    actual = limit_lines(story)
    assert len(actual) == len(expected) and all(nudge.is_in(line) for nudge, line in zip(expected, actual)), actual


def expect_limit_lines_2(story, expected) -> None:
    actual = len(limit_lines(story))
    assert actual == expected, actual
