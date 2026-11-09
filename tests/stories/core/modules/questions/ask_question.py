from tests.stories.core.support.coding_fixtures import UserBuilder
from core.base.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import AgentStarted


def test_the_recommended_option_is_put_first_and_marked(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres mysql --recommend postgres --environment main',
                         "question 1 asked; waiting for the answer", "1. postgres (recommended)", "2. sqlite", "3. mysql", actor=story.agent)


def test_a_recommendation_that_is_not_an_option_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --recommend mysql --environment main',
                         "the recommended choice is not one of the options: mysql", actor=story.agent)


def test_a_question_without_options_is_asked_open_ended(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_success('question ask "What should the page be called?" --context "A story asks this so its card and answer can be checked." --environment main', "question 1 asked; waiting for the answer", actor=story.agent)


def test_a_question_without_an_environment_is_refused(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --context "A story asks this so its card and answer can be checked."', "a question needs an environment")


def test_the_user_cannot_ask(new_story):
    story = new_story(fixture=AgentStarted)
    story.expect_refusal('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', "nobody can answer a question asked from here", actor=story.user)


def test_a_message_read_while_a_question_waits_is_marked_read(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success('question ask "What should the page be called?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.expect_success('message send "See you tomorrow" --environment main', actor=story.user)
    story.hook("s-1", HookSamples.shell("journal message read 1", ShellPart("journal", CommandCategory.JOURNAL, ["message", "read", "1"], subcommand="message")).with_fields(event="post_tool_use"))
    story.expect_text("message show 1", "read_at: 20", actor=story.agent)

