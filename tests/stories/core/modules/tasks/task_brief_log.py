from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderStarted, BuilderWithUser


class StartedTask(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('task make "Fix the total" --brief "Cents" --environment main', actor=story.agent)
        story.run("task start 1", actor=story.agent)


def test_a_brief_prints_the_log_lines_after_the_comments(new_story):
    story = new_story(fixture=StartedTask)
    story.run("task log 1 'the first step'", actor=story.agent)
    story.run("task log 1 'the second step'", actor=story.agent)
    story.expect_text("task overview 1", "log: the first step", "log: the second step", actor=story.agent)


def test_an_overview_shows_the_last_5_log_lines_and_says_how_many_are_older(new_story):
    story = new_story(fixture=StartedTask)
    for step in range(1, 8):
        story.run(f"task log 1 'step number {step}'", actor=story.agent)
    story.expect_text("task overview 1", "log: step number 3", "log: step number 7", "2 older log lines: journal task-log list --task 1", actor=story.agent)
    story.expect_absent("task overview 1", "log: step number 2", actor=story.agent)


def test_an_overview_shows_the_last_5_comments_and_says_how_many_are_older(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the total" --brief "Cents" --environment main', actor=story.agent)
    for number in range(1, 8):
        story.run(f"task comment 1 'remark number {number}' --environment main", actor=story.user)
    story.expect_text("task overview 1", "remark number 3", "remark number 7", "2 older comments: journal task comments 1", actor=story.agent)
    story.expect_absent("task overview 1", "remark number 2", actor=story.agent)


def test_a_brief_with_no_log_prints_no_log_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the total" --brief "Cents" --environment main', actor=story.agent)
    story.expect_absent("task overview 1", "log:", actor=story.agent)
