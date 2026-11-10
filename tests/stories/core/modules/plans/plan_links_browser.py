from engine.command.bus import Bus
from core.modules.documents.commands.record_mentions.record_mentions import RecordMentions
from core.modules.documents.references.row_ref import RowRef
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story

TASKS = 70
MESSAGES = 30


def test_a_plan_with_a_hundred_links_shows_a_compact_linked_section(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.run('plan make "Rebuild the cart" --brief "The cart must keep its totals." --environment main')
    for number in range(1, TASKS + 1):
        story.run(f'task make "Linked task {number}" --brief "Sample" --environment main')
    for number in range(1, MESSAGES + 1):
        story.run(f'message send "Linked message {number}" --environment main', actor=story.user)
    text = " ".join([f"task {number}" for number in range(1, TASKS + 1)] + [f"message {number}" for number in range(1, MESSAGES + 1)])
    story.container.get(Bus).run(RecordMentions(RowRef("plan", 1), tuple([text])), story.user, environment_id=1)
    with server_story(story) as server:
        expect_browser(server, "planLinks.browser.mjs", ["/tmp/journal-worker-680-plan-links.png"])
