from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from tests.stories.suites.coding.modules.workers.support.program_split import split_story


def test_a_person_saves_shares_routes_and_an_outage_in_the_split_tab(split_story):
    story = split_story
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.expect_success("task tag 1 networking linux --confirm", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "workerSplit.browser.mjs", ["/tmp/journal-worker-688-split.png"])
    story.expect_text("worker-route list", "codex", "strongest", "networking")
    story.expect_text("setting show journal.core.helpers.program-split", "claude 65", "codex 35")
