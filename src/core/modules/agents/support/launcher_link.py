import json
import socket
import time
from collections.abc import Mapping

from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.modules.agents.support.launcher_service import LauncherService

ANSWER_LIMIT_SECONDS = 9
ANSWER_BYTES = 32
STOPPED_ANSWER = b"stopped\n"
STOP_FIELD = "stop"
START_FIELD = "command"
IDLE_FIELD = "quiet"
REFUSED_TRIES = 3
REFUSED_PAUSE_SECONDS = 0.1


class LauncherLink:
    """Hands the running launcher a request on its socket; with an answer asked for, gives what it answered,
    and gives nothing when it could not be reached. A socket nobody answers on, left by a launcher that was
    killed, is removed, and a request to start a program then goes to a launcher started in its place."""

    def __init__(self, home: JournalHome, service: LauncherService) -> None:
        self.home, self.service = home, service

    @property
    def is_running(self) -> bool:
        return self.home.socket(LAUNCHER_SOCKET).exists()

    def stop(self, agent_id: int) -> bool:
        return self.request_launcher({"agent_id": agent_id, STOP_FIELD: True}, ANSWER_BYTES) == STOPPED_ANSWER

    def idle_seconds(self, agent_id: int) -> int | None:
        answer = self.request_launcher({"agent_id": agent_id, IDLE_FIELD: True}, ANSWER_BYTES)
        fields = answer.split() if answer else []
        return int(fields[1]) if len(fields) == 2 and fields[0] == b"quiet" and fields[1].isdigit() else None

    def request_stop(self, agent_id: int) -> None:
        self.request_launcher({"agent_id": agent_id, STOP_FIELD: True})

    def request_launcher(self, request: Mapping[str, object], answer_bytes: int = 0) -> bytes | None:
        path = self.home.socket(LAUNCHER_SOCKET)
        if not path.exists():
            return None
        try:
            return self.exchanged(request, answer_bytes)
        except ConnectionRefusedError:
            return self.after_refusal(request, answer_bytes)
        except OSError:
            return None

    def after_refusal(self, request: Mapping[str, object], answer_bytes: int) -> bytes | None:
        for _ in range(REFUSED_TRIES):
            time.sleep(REFUSED_PAUSE_SECONDS)
            try:
                return self.exchanged(request, answer_bytes)
            except ConnectionRefusedError:
                continue
            except OSError:
                return None
        self.home.socket(LAUNCHER_SOCKET).unlink(missing_ok=True)
        return self.exchanged_after_start(request, answer_bytes) if START_FIELD in request and self.service.start() else None

    def exchanged_after_start(self, request: Mapping[str, object], answer_bytes: int) -> bytes | None:
        try:
            return self.exchanged(request, answer_bytes)
        except OSError:
            return None

    def exchanged(self, request: Mapping[str, object], answer_bytes: int) -> bytes:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
            connection.settimeout(ANSWER_LIMIT_SECONDS)
            connection.connect(str(self.home.socket(LAUNCHER_SOCKET)))
            connection.sendall((json.dumps(request) + "\n").encode())
            return connection.recv(answer_bytes) if answer_bytes else b""
