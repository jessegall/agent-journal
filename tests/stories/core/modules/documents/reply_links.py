from datetime import timedelta

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def replied_story(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.run('message reply 1 "On it"', actor=story.agent)
    return story


def test_a_task_the_agent_makes_right_after_replying_links_to_the_message_it_answered(new_story):
    story = replied_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_plan_a_document_and_a_report_link_too(new_story):
    story = replied_story(new_story)
    story.run('plan make "Cart" --environment main', actor=story.agent)
    story.run('doc make "Cart rules" --abstract "Rules" --body "Rules" --environment main', actor=story.agent)
    story.run('report make "Cart review" --abstract "Review" --body "Review" --environment main', actor=story.agent)
    story.run_listeners()
    lines = story.run("message read 1", actor=story.user).output_text
    assert "plan:1" in lines and "doc:" in lines and "report:" in lines


def test_a_task_made_more_than_two_minutes_after_the_reply_is_not_linked(new_story):
    story = replied_story(new_story)
    story.advance(timedelta(seconds=121))
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run_listeners()
    assert "links:" not in story.run("message read 1", actor=story.user).output_text


def test_a_task_made_with_no_reply_to_a_person_is_not_linked(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "Fix the cart" --environment main', actor=story.user)
    story.run('message send "Working on it" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run_listeners()
    assert "links:" not in story.run("message read 1", actor=story.user).output_text


def test_a_task_the_person_makes_is_not_linked(new_story):
    story = replied_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.user)
    story.run_listeners()
    assert "links:" not in story.run("message read 1", actor=story.user).output_text


def test_an_edit_of_a_tasks_text_right_after_a_reply_links_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=300))
    story.run('message send "Round it too" --environment main', actor=story.user)
    story.run('message reply 1 "Adding that"', actor=story.agent)
    story.run('task edit 1 --brief "Also round it"', actor=story.agent)
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_change_of_a_task_that_is_not_its_text_does_not_link_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=300))
    story.run('message send "Carry on" --environment main', actor=story.user)
    story.run('message reply 1 "Starting"', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.run_listeners()
    assert "links:" not in story.run("message read 1", actor=story.user).output_text


def test_a_task_a_reply_names_links_to_the_message_it_answers(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.advance(timedelta(seconds=300))
    story.run('message send "Is it filed" --environment main', actor=story.user)
    story.run('message reply 1 "Yes, it is task 1"', actor=story.agent)
    story.run_listeners()
    story.expect_text("message read 1", "links: task:1", actor=story.user)


def test_a_reply_naming_a_task_that_does_not_exist_links_nothing(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run('message send "Is it filed" --environment main', actor=story.user)
    story.run('message reply 1 "No, task 99 is gone"', actor=story.agent)
    story.run_listeners()
    assert "links:" not in story.run("message read 1", actor=story.user).output_text


def test_a_row_is_linked_once_however_often_it_is_edited(new_story):
    story = replied_story(new_story)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task edit 1 --brief "Also round it"', actor=story.agent)
    story.run_listeners()
    assert story.run("message read 1", actor=story.user).output_text.count("task:1") == 1
