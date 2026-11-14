import json


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
