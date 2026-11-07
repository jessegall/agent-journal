from urllib.parse import urlencode

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_search_window_reads_all_words_and_the_selected_model_through_its_key(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "Fix the cart" --brief "totals in cents" --environment main', actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        query = urlencode({"environment": "main", "results.terms": "cart cents", "results.model": "task"})
        status, answer = window_data(server, cookie, keys="results", window="search.search", query=query)
        result = answer["keys"]["results"]
        story.expect_rows(status == 200, result["code"] == 0, result["value"]["total"] == 1,
                          result["value"]["hits"][0]["cli_name"] == "task")
