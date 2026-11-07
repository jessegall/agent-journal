from core.base.driver.command_category import CommandCategory
from tests.stories.core.modules.processes.run_queue import expect_absent_slot, expect_slot, expect_waits, queued
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.queue_fixtures import QueueAgents

JUDGE_LINE = "journal sins --changes"


def test_a_judge_line_waits_for_a_free_place_while_tests_run(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    first, second = queued(story, "make one"), queued(story, "make two")
    judge = queued(story, JUDGE_LINE, CommandCategory.TEST_RUN)
    expect_absent_slot(story, judge)
    expect_waits(story, judge)
    end_run(story, first, "ok\n")
    expect_slot(story, judge)
    expect_slot(story, second)


def test_a_judge_line_is_a_run_of_the_queue_like_a_test_run(new_story):
    story = install_runner(new_story(fixture=QueueAgents))
    judge = queued(story, JUDGE_LINE, CommandCategory.TEST_RUN)
    story.expect_text("queue list --environment 1", JUDGE_LINE, actor=story.agent)
    expect_slot(story, judge)
