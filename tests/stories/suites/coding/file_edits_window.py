from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.scanned_edits import scanned_edit
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_the_file_edits_window_pages_its_declared_key_through_the_viewer(new_story):
    story = new_story(fixture=BuilderStarted)
    scanned_edit(story, "s-1", "src/cart.py", 3, 1)
    scanned_edit(story, "s-1", "src/tax.py", 2, 0)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, window="coding.file-edits", query="environment=main&edits.limit=1")
        story.expect_rows(status == 200, set(answer["keys"]) == {"edits"})
        newest = answer["keys"]["edits"]["value"]["rows"][0]
        story.expect_rows(newest["path"] == "src/tax.py", newest["session_agent_id"] == story.agent.id)
        status, older = window_data(server, cookie, keys="edits", window="coding.file-edits",
                                   query=f"environment=main&edits.limit=1&edits.before-id={newest['id']}")
        story.expect_rows(status == 200, older["keys"]["edits"]["value"]["rows"][0]["path"] == "src/cart.py")
