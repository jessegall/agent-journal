from tests.stories.core.modules.messages.attachments import attached_story
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_attachments_window_reads_a_filtered_page_through_its_key(new_story):
    story = attached_story(new_story)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = "environment=main&attachments.category=images&attachments.search=shop&attachments.skip=0"
        status, answer = window_data(server, cookie, window="messages.attachments", query=query)
        page = answer["keys"]["attachments"]
        story.expect_rows(status == 200, page["code"] == 0, [row["name"] for row in page["value"]["rows"]] == ["shop.jpg"])
