import json

from tests.stories.core.modules.agents.agent_limits import agent_limits_server  # noqa: F401
from tests.stories.server.window_data_route import window_data


def test_probe(agent_limits_server):
    server, cookie = agent_limits_server
    answer = server.viewer_line_value(cookie, {"window": "coding.work-mode", "environment": "main", "line": ["setting-screen", "show", "helper-type", "--type", "workers"]})
    print("LINE", json.dumps(answer)[:600])
    status, data = window_data(server, cookie, keys="type-screen", window="coding.work-mode", query="environment=main&type-screen.type=workers")
    print("WINDOW", status, json.dumps(data)[:900])
    assert False
