from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_document_keys_keep_type_state_and_before_with_viewer_created_texts(new_story):
    story = new_story(fixture=UserJoined)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        for title in ("Cart rules", "Tax rules"):
            server.viewer_line_value(cookie, {"window": "documents.documents", "environment": "main",
                                              "line": ["doc", "make", title, "--abstract", title, "--body", "Count in cents"]})
        query = "environment=main&library.type=doc&library.state=open"
        status, answer = window_data(server, cookie, window="documents.documents", query=query)
        rows = answer["keys"]["library"]["value"]["rows"]
        story.expect_rows(status == 200, set(answer["keys"]) == {"library"}, [row["title"] for row in rows] == ["Tax rules", "Cart rules"])
        status, older_page = window_data(server, cookie, keys="library", window="documents.documents", query=f"{query}&library.before={rows[0]['id']}")
        story.expect_rows(status == 200, [row["title"] for row in older_page["keys"]["library"]["value"]["rows"]] == ["Cart rules"],
                          older_page["keys"]["library"]["value"]["total"] == 2)
        status, reports = window_data(server, cookie, keys="library", window="documents.documents", query="environment=main&library.type=report&library.state=open")
        story.expect_rows(status == 200, reports["keys"]["library"]["value"]["rows"] == [])
