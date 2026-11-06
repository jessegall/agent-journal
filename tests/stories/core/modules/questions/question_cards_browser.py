from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

LONG_CONTEXT = ("The process queue shows commands from workers, builds and tests together. Should a command that a worker started by itself and a command the main agent started "
                 "share one list, or should the main agent's commands be kept out of the queue unless the user turns that on in the settings?")

LONG_ANSWER = "Keep the main agent out of the queue unless the user turns it on in the settings, and show the commands of workers and builds together in one list"


def test_the_questions_window_shows_one_block_per_question_at_wide_and_phone_width(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success(f'question ask "Should the queue share one list?" --context "{LONG_CONTEXT}" --options "One list for every command" "Keep the main agent out unless the user turns it in" --recommend "Keep the main agent out unless the user turns it in" --environment main', actor=story.agent)
    story.expect_success('question ask "Delete the old test queue inspector?" --context "A story asks this so its card and answer can be checked." --options "Yes, delete it" "No, keep it for now" --recommend "Yes, delete it" --environment main', actor=story.agent)
    story.expect_success('question ask "Which name should the window use?" --context "A story asks this so its card and answer can be checked." --options "Questions" "Asks" --environment main', actor=story.agent)
    story.expect_success(f'question answer 3 --answer "{LONG_ANSWER}"')
    with server_story(story) as server:
        expect_browser(server, "questionCards.browser.mjs", ["/tmp/journal-worker-536-question-cards"])
