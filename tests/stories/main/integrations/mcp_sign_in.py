from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.new_session import NewSession


@story(NewSession, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_server_is_signed_in_by_the_address_the_browser_ended_on_handed_to_the_program_waiting_here(story):
    result = story.user_presses("/journal/mcp/sentry/sign-in", {})
    result.expect_viewer_text("https://sign-in.test/authorize")
    back = story.sign_in_page_return()
    result = story.user_presses("/journal/mcp/sentry/callback", {"url": f"{back}?code=good&state=s1"})
    result.expect_viewer_shows("signed_in", "sentry")
    story.expect_stack(story.agents.subject, Ready)


@story(NewSession, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_code_the_server_refused_is_reported_in_the_programs_words_with_the_code_hidden(story):
    story.user_presses("/journal/mcp/pipedrive/sign-in", {})
    back = story.sign_in_page_return()
    result = story.user_presses("/journal/mcp/pipedrive/callback", {"url": f"{back}?code=secret-code-4471&state=s1"})
    result.expect_viewer_refused("the server refused")
    result.expect_viewer_never_says("secret-code-4471")
    story.expect_stack(story.agents.subject, Ready)


@story(NewSession, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_an_address_on_another_machine_is_refused_and_the_program_keeps_waiting_for_the_right_one(story):
    story.user_presses("/journal/mcp/linear/sign-in", {})
    back = story.sign_in_page_return()
    result = story.user_presses("/journal/mcp/linear/callback", {"url": f"{back.replace('localhost', 'sign-in.test')}?code=good&state=s1"})
    result.expect_viewer_refused("http://localhost or http://127.0.0.1")
    result.expect_viewer_never_says("code=good")
    result = story.user_presses("/journal/mcp/linear/callback", {"url": f"{back}?code=good&state=s1"})
    result.expect_viewer_shows("signed_in", "linear")
    story.expect_stack(story.agents.subject, Ready)


@story(NewSession, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_an_address_pasted_with_no_sign_in_waiting_is_refused(story):
    result = story.user_presses("/journal/mcp/notion/callback", {"url": "http://localhost:8976/callback?code=good&state=s1"})
    result.expect_viewer_refused("no sign-in to notion is waiting: press Sign in first")
    story.expect_stack(story.agents.subject, Ready)


@story(NewSession, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_name_a_program_could_read_as_an_option_is_never_signed_in(story):
    result = story.user_presses("/journal/mcp/--help/sign-in", {})
    result.expect_viewer_refused("starts with a letter or a digit")
    story.expect_stack(story.agents.subject, Ready)
