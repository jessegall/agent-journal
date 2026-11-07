import json
from dataclasses import dataclass

from tests.stories.server.support.server_client import ServerStory
from core.base.change.event_log import EventLog


@dataclass(frozen=True)
class LoggedViewer:
    server: ServerStory
    cookie: str
    cursor_id: int

    def stream(self, patterns: list[str]):
        return self.server.viewer_stream(self.cookie, self.cursor_id, patterns)

    def hook_event_count(self) -> int:
        return len(self.server.story.container.get(EventLog).events_past(self.cursor_id))


def expect_event(response, name):
    while True:
        line = response.readline().decode()
        assert line, "The event stream ended before its event"
        if not line.startswith("data: "):
            continue
        value = json.loads(line[6:])
        if "event" not in value:
            continue
        assert value["event"] == name, value
        return value["id"]


def expect_cursor(response, cursor_id):
    assert response.readline().decode() == "event: cursor\n"
    assert json.loads(response.readline().decode().removeprefix("data: ")) == {"id": cursor_id}
    assert response.readline().decode() == "\n"
