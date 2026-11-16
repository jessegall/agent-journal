import pytest

import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
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


def test_a_message_read_no_longer_counts(half_hour_session):
    story = half_hour_session
    story.hook("s-1", READ_LINE)
    story.expect_rows(measure(fitness(story), "message_wait")["value"] == 0)


def test_messages_arriving_faster_than_answered_raise_the_load_and_its_level(new_story):
    story = new_story(fixture=UserJoined)
    for number in range(2):
        story.expect_success(f'message send "Fix {number}" --environment main', actor=story.user)
    answer = fitness(story)
    story.expect_rows(answer["workload"] == 2.0, answer["workload_level"] == "critical", answer["arrivals_hourly"] == 4, answer["answers_hourly"] == 0, answer["waiting_messages"] == 2)


def test_tasks_closed_in_the_last_two_hours_count_and_older_ones_do_not(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "Fix the cart" --environment main', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.expect_rows(measure(fitness(story), "completion_rate")["value"] == 0.5)
    story.advance(timedelta(hours=3))
    story.expect_rows(measure(fitness(story), "completion_rate")["value"] == 0)



@pytest.fixture
def half_hour_session(new_story):
    story = new_story(fixture=UserJoined)
    story.advance(HALF_HOUR)
    story.expect_success('message send "Fix the cart" --environment main', actor=story.user)
    story.advance(timedelta(minutes=15))
    return story


def test_an_agent_can_read_another_agents_wait_share(new_story):
    story = new_story(fixture=UserJoined)
    helper = Actor(story.new_row_id(f"agent start s-2 claude helper --parent {story.agent.id} --environment main"), ActorType.AGENT)
    story.expect_success("wait stuck 'the build is down'", actor=helper)
    story.advance(timedelta(minutes=30))
    answer = json.loads(story.run(f"usage fitness --agent {helper.id} --json", actor=story.agent).output_text)
    story.expect_rows(measure(answer, "wait_share")["value"] == 0.5)
