import json
from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.support.fixtures import UserJoined

HALF_HOUR = timedelta(minutes=31)
READ_LINE = HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use")


def fitness(story) -> dict:
    return json.loads(story.run(f"usage fitness --agent {story.agent.id} --json", actor=story.user).output_text)


def measure(answer: dict, key: str) -> dict:
    return next(row for row in answer["measures"] if row["key"] == key)


def test_an_agent_is_not_measured_in_its_first_half_hour(new_story):
    story = new_story(fixture=UserJoined)
    answer = fitness(story)
    story.expect_rows(answer["is_measured"] is False, answer["score"] is None)
    story.expect_text(f"usage fitness --agent {story.agent.id}", "fitness not measured yet", actor=story.user)


def test_with_nothing_waiting_an_agent_scores_full_marks(new_story):
    story = new_story(fixture=UserJoined)
    story.advance(HALF_HOUR)
    answer = fitness(story)
    story.expect_rows(answer["is_measured"] is True, answer["score"] == 100, answer["load"] == 0)


def test_a_message_left_waiting_lowers_the_score(new_story):
    story = new_story(fixture=UserJoined)
    story.advance(HALF_HOUR)
    story.expect_success('message send "Fix the cart" --environment main', actor=story.user)
    story.advance(timedelta(minutes=15))
    answer = fitness(story)
    waited = measure(answer, "message_wait")
    story.expect_rows(waited["value"] == 15, waited["closeness"] == 0.6, answer["score"] == 80)


def test_a_message_read_no_longer_counts(new_story):
    story = new_story(fixture=UserJoined)
    story.advance(HALF_HOUR)
    story.expect_success('message send "Fix the cart" --environment main', actor=story.user)
    story.advance(timedelta(minutes=15))
    story.hook("s-1", READ_LINE)
    story.expect_rows(measure(fitness(story), "message_wait")["value"] == 0)


def test_messages_arriving_faster_than_answered_raise_the_load_and_its_level(new_story):
    story = new_story(fixture=UserJoined)
    for number in range(2):
        story.expect_success(f'message send "Fix {number}" --environment main', actor=story.user)
    answer = fitness(story)
    story.expect_rows(answer["load"] == 2.0, answer["load_level"] == "critical")


def test_tasks_closed_in_the_last_two_hours_count_and_older_ones_do_not(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "Fix the cart" --environment main', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.expect_rows(measure(fitness(story), "completion_rate")["value"] == 0.5)
    story.advance(timedelta(hours=3))
    story.expect_rows(measure(fitness(story), "completion_rate")["value"] == 0)

