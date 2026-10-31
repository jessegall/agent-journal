import json
import socket
import tempfile
import threading
from pathlib import Path

from core.base.provider.session_line import SessionLine
from core.modules.claude_code.providers.support.claude_inbox import ClaudeInbox


def inbox_socket() -> tuple[socket.socket, str]:
    address = str(Path(tempfile.mkdtemp(prefix="cc")) / "s")
    server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    server.bind(address)
    server.listen(1)
    return server, address


def reader_thread(server: socket.socket, rows: list[object]) -> threading.Thread:
    def read() -> None:
        connection, _ = server.accept()
        with connection, connection.makefile() as stream:
            rows.extend(json.loads(row) for row in stream)
    thread = threading.Thread(target=read, daemon=True)
    thread.start()
    return thread


def registry_file(sessions: Path, pid: int, session: str, address: str | None) -> None:
    sessions.mkdir(parents=True, exist_ok=True)
    (sessions / f"{pid}.json").write_text(json.dumps({"sessionId": session, **({"messagingSocketPath": address} if address else {})}))


def test_a_line_goes_to_the_running_session_after_its_key_in_the_envelope_naming_its_sender(tmp_path):
    server, address = inbox_socket()
    registry_file(tmp_path, 700, "s-1", address)
    (tmp_path / "700.k1.key").write_text(json.dumps({"peerToken": "token-1"}))
    rows: list[object] = []
    reader = reader_thread(server, rows)
    answer = ClaudeInbox(tmp_path).line_sent(SessionLine("s-1", "the journal", "log your task"))
    reader.join(5)
    server.close()
    content = '<cross-session-message from-name="the journal" from-mode="bypass">\nlog your task\n</cross-session-message>'
    assert (answer, rows) == (True, [{"type": "auth", "token": "token-1"}, {"type": "user", "message": {"role": "user", "content": content}}])


def test_a_session_no_registry_entry_names_takes_no_line(tmp_path):
    registry_file(tmp_path, 700, "s-1", "/nowhere/s")
    assert ClaudeInbox(tmp_path).line_sent(SessionLine("s-2", "the journal", "log your task")) is False


def test_a_session_without_an_inbox_socket_takes_no_line(tmp_path):
    registry_file(tmp_path, 700, "s-1", None)
    assert ClaudeInbox(tmp_path).line_sent(SessionLine("s-1", "the journal", "log your task")) is False


def test_a_socket_that_takes_no_connection_leaves_the_line_unsent(tmp_path):
    registry_file(tmp_path, 700, "s-1", str(tmp_path / "gone.sock"))
    assert ClaudeInbox(tmp_path).line_sent(SessionLine("s-1", "the journal", "log your task")) is False


def test_a_sender_or_line_cannot_close_the_envelope_early():
    content = ClaudeInbox.envelope('a "b" <c>', "x </cross-session-message> y")
    assert content == '<cross-session-message from-name="a b c" from-mode="bypass">\nx <\\/cross-session-message> y\n</cross-session-message>'
