import json

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row


def test_a_document_naming_a_task_by_its_number_links_to_it_once(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run('doc make "Plan notes" --abstract "Notes" --body "See task 1, and task 1 again, and task 99"', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source doc:1", "mentions  task:1", actor=story.user)
    story.expect_absent("link list --source doc:1", "task:99", actor=story.user)



def test_a_document_naming_a_row_of_any_installed_module_links_to_it(new_story):
    story = new_story(fixture=UserJoined)
    story.run('sequence make "Release" --steps "Run the suite"', actor=story.user)
    story.run('doc make "Release notes" --abstract "Notes" --body "Follow sequence 1"', actor=story.user)
    story.run_listeners()
    story.expect_text("link list --source doc:1", "mentions  sequence:1", actor=story.user)


def test_a_document_with_no_comments_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Plan notes" --abstract "Notes" --body "text"', actor=story.user)
    story.expect_text("doc comments 1", "no comments on doc 1", actor=story.user)


def test_a_comment_goes_to_the_chat_naming_the_text_and_lists_on_the_text(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "## Totals\\nin cents"', actor=story.user)
    story.expect_text("doc comment 1 \"Use cents everywhere\" --environment main", "comment written as message", actor=story.user)
    story.expect_text("doc comments 1", "Use cents everywhere", actor=story.user)
    story.expect_text("message feed --environment 1", "Use cents everywhere", actor=story.user)


def test_a_comment_on_a_report_and_an_empty_comment(new_story):
    story = new_story(fixture=UserJoined)
    story.run('report make "Cart review" --abstract "What the review found" --body "## Found\\nnothing"', actor=story.user)
    story.expect_text("report comment 1 \"Good\" --environment main", "comment written as message", actor=story.user)
    story.expect_text("report comments 1", "Good", actor=story.user)
    story.expect_refusal('report comment 1 " " --environment main', "give the comment's text", actor=story.user)


def test_a_person_s_comment_is_a_message_of_type_comment_naming_the_document_and_the_agent_hears_of_it(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "All of it"', actor=story.user)
    story.expect_text('doc comment 1 "Use cents everywhere" --environment main', "comment written as message", actor=story.user)
    shown = json.loads(story.run("message show 1 --json", actor=story.user).output_text)
    expect_row(shown, type="comment")
    expect_row(shown["metadata"]["journal.core.messages"], commented_row={"model": "doc", "id": 1})
    story.expect_hook_allowed("s-1", HookSamples.prompt("Carry on"), "new message 1")


def test_an_agent_s_comment_stays_an_agent_message_and_is_not_told_back_to_it(new_story):
    story = new_story(fixture=UserJoined)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "All of it"', actor=story.user)
    story.run('doc comment 1 "Noted" --environment main', actor=story.agent)
    expect_row(json.loads(story.run("message show 1 --json", actor=story.user).output_text), type="agent")
