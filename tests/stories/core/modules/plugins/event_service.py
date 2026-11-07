import json
import socket
import threading

import pytest

from core.modules.plugins.support.plugin_socket_paths import PluginSocketPaths
from tests.stories.core.modules.plugins.support.event_stories import SECOND_JOB, TASK_CREATED, event_page, event_plugin_story, install_event_plugin, plugin_data, plugin_row, script_calls

SOCKET_SERVICE = [{"name": "web", "command": ["see.sh"], "answers": True}]
WAIT_SECONDS = 10


@pytest.fixture
def service_socket():
    received_lines: list[str] = []
    servers: list[socket.socket] = []

    def start_service(story, answer: str) -> list[str]:
        path = story.container.get(PluginSocketPaths).answers("events", "web")
        path.parent.mkdir(parents=True, exist_ok=True)
        server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        server.bind(str(path))
        server.listen(1)
        server.settimeout(WAIT_SECONDS)
        servers.append(server)

        def serve_connection() -> None:
            connection, _ = server.accept()
            received_lines.append(connection.recv(65536).decode())
            connection.sendall(answer.encode())
            connection.close()

        threading.Thread(target=serve_connection, daemon=True).start()
        return received_lines

    yield start_service
    for server in servers:
        server.close()


def test_a_commit_entry_reaches_the_answering_service_and_starts_no_program(new_story, service_socket):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "service:web"}, services=SOCKET_SERVICE)
    received_lines = service_socket(story, json.dumps({"v": 1, "tell": "heard"}) + "\n")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(TASK_CREATED in received_lines[0], not script_calls(story, "see.sh"), plugin_row(story).fault_count == 0, len(list(plugin_data(story, "queue").glob("delivery-*.json"))) == 1)


def test_a_service_that_ends_the_connection_with_no_answer_releases_the_wait(new_story, service_socket):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "service:web"}, services=SOCKET_SERVICE)
    service_socket(story, "")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(plugin_row(story).fault_count == 0)


def test_a_name_that_is_no_answering_service_is_wrong_on_the_card(event_page):
    install_event_plugin(event_page.story, {"event": TASK_CREATED, "commit": "service:nowhere"}, services=SOCKET_SERVICE)
    event_page.story.expect_rows([row["state"] for row in event_page.card()] == ["wrong script"])


def test_a_closed_socket_falls_back_to_the_program(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "service:web"}, services=SOCKET_SERVICE, program="see.sh")
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows(len(script_calls(story, "see.sh")) == 1, plugin_row(story).fault_count == 0)


def test_a_closed_socket_with_no_program_is_a_fault(new_story):
    story = event_plugin_story(new_story, {"event": TASK_CREATED, "commit": "service:web"}, services=SOCKET_SERVICE)
    story.expect_success(SECOND_JOB, actor=story.agent)
    story.run_listeners()
    story.expect_rows("its service web is not answering" in plugin_row(story).last_fault)
