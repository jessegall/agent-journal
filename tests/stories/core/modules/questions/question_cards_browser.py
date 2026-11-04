from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

LONG_QUESTION = ("The process queue shows commands from workers, builds and tests together. Should a command that a worker started by itself and a command the main agent started "
                 "share one list, or should the main agent's commands be kept out of the queue unless the user turns that on in the settings?")


def test_the_questions_window_shows_flush_full_width_cards_at_wide_and_phone_width(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success(f'question ask "{LONG_QUESTION}" --options "One list for every command" "Keep the main agent out unless the user turns it in" --recommend "Keep the main agent out unless the user turns it in" --environment main', actor=story.agent)
    story.expect_success('question ask "Delete the old test queue inspector?" --options "Yes, delete it" "No, keep it for now" --recommend "Yes, delete it" --environment main', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "questionCards.browser.mjs", ["/tmp/journal-worker-536-question-cards"])
