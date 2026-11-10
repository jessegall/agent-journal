from engine.query.queries import Queries
from core.modules.documents.models.doc import Doc
from core.modules.docking.models.dock_item import DockItem
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_new_dock_keeps_the_chat_at_the_readers_position(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('setting set journal.core.viewer.tour-completed true --project')
    for number in range(1, 31):
        story.expect_success(f'message send "Scroll message {number}" --environment main')
    with server_story(story) as server:
        for _ in range(10):
            expect_browser(server, 'dockScroll.browser.mjs', [])
            for title in ('First dock', 'Second dock'):
                doc = story.container.get(Queries).query(Doc).filter(title=title).newest().first()
                item = story.container.get(Queries).query(DockItem).filter(target_model="doc", target_id=doc.id).newest().first()
                story.expect_success(f"dock remove {item.id}", actor=story.user)
