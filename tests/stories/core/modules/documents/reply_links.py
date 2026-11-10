import pytest
from unittest.mock import patch

from engine.query.query import Query
from core.modules.messages.models.message import Message
from engine.testing.stories.story_fixture import StoryFixture

from datetime import timedelta

from tests.stories.core.modules.drivers.hook_durations import UserBuilder
from tests.stories.support.story_checks import expect_count_output, expect_value


class RepliedCartMessage(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.run('message send "Fix the cart" --environment main', actor=story.user)
        story.run('message reply 1 "On it"', actor=story.agent)


def replied_story(new_story):
    return new_story(fixture=RepliedCartMessage)


def test_a_task_the_agent_makes_right_after_replying_links_to_the_message_it_answered(replied_task):
    story = replied_task
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_linking_a_task_reads_the_latest_reply_without_counting_messages(new_story):
    story = replied_story(new_story)
    with patch.object(Query, "count", autospec=True, side_effect=Query.count) as counts:
        story.run('task make "Fix the totals" --environment main', actor=story.agent)
        story.run_listeners()
    expect_value([call.args[0].model for call in counts.call_args_list if call.args[0].model is Message], [])
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_plan_a_document_and_a_report_link_too(new_story):
    story = replied_story(new_story)
    story.run('plan make "Cart" --environment main', actor=story.agent)
    story.run('doc make "Cart rules" --abstract "Rules" --body "Rules" --environment main', actor=story.agent)
    story.run('report make "Cart review" --abstract "Review" --body "Review" --environment main', actor=story.agent)
    story.run_listeners()
    lines = story.run("message read 1", actor=story.user)
    lines.expect_text("plan:1")
    lines.expect_text("doc:")
    lines.expect_text("report:")


def test_a_selected_request_still_links_work_after_more_than_two_minutes(new_story):
    story = replied_story(new_story)
    story.advance(timedelta(seconds=121))
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_task_made_with_no_reply_to_a_person_is_not_linked(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.run('message send "Working on it" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_no_text("message read 1", "links:", actor=story.user)


def test_a_task_the_person_makes_is_not_linked(new_story):
    story = replied_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.user)
    story.run_listeners()
    story.expect_no_text("message read 1", "links:", actor=story.user)


def test_an_edit_of_a_tasks_text_right_after_a_reply_links_it(old_task):
    story = old_task
    story.run('message send "Round it too" --environment main', actor=story.user)
    story.run('message reply 1 "Adding that"', actor=story.agent)
    story.run('task edit 1 --brief "Also round it"', actor=story.agent)
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_change_of_a_task_that_is_not_its_text_does_not_link_it(old_task):
    story = old_task
    story.run('message send "Carry on" --environment main', actor=story.user)
    story.run('message reply 1 "Starting"', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.run_listeners()
    story.expect_no_text("message read 1", "links:", actor=story.user)


def test_a_reply_naming_a_task_that_does_not_exist_links_nothing(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('message send "Is it filed" --environment main', actor=story.user)
    story.run('message reply 1 "No, task 99 is gone"', actor=story.agent)
    story.run_listeners()
    story.expect_no_text("message read 1", "links:", actor=story.user)


def test_a_row_is_linked_once_however_often_it_is_edited(replied_task):
    story = replied_task
    story.run('task edit 1 --brief "Also round it"', actor=story.agent)
    story.run_listeners()
    expect_count_output(story, "message read 1", "task:1", 1)


@pytest.fixture
def old_task(new_story):
    story = new_story(fixture=UserBuilder)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=300))
    return story


@pytest.fixture
def replied_task(new_story):
    story = replied_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    return story
