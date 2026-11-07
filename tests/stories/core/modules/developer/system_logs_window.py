from tests.stories.server.developer_system_logs import logs_server
from tests.stories.server.window_data_route import window_data


def test_system_log_key_filters_before_paging_and_reloads_only_logs(logs_server):
    server = logs_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    query = "environment=main&logs.source=server&logs.level=warning&logs.limit=1"
    status, answer = window_data(server, cookie, window="developer.system-logs", query=query)
    page = answer["keys"]["logs"]["value"]
    server.story.expect_rows(status == 200, set(answer["keys"]) == {"logs"}, len(page["rows"]) == 1, page["total"] >= 2,
                             all(row["source"] == "server" and row["level"] == "warning" for row in page["rows"]))
    status, older = window_data(server, cookie, keys="logs", window="developer.system-logs", query=f"{query}&logs.page=2")
    server.story.expect_rows(status == 200, set(older["keys"]) == {"logs"}, len(older["keys"]["logs"]["value"]["rows"]) == 1,
                             older["keys"]["logs"]["value"]["rows"][0]["id"] != page["rows"][0]["id"])
