import json
import socket

from journal.support.supervisor_reply import SupervisorReply

WAIT_SECONDS = 5.0


class SupervisorSocket:
    """One request to a supervisor on the protocol: a line of JSON out, a line back."""

    @staticmethod
    def ask(path: str, request: dict) -> SupervisorReply:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
            link.settimeout(WAIT_SECONDS)
            link.connect(path)
            link.sendall((json.dumps(request) + "\n").encode())
            return SupervisorReply.parsed(json.loads(link.makefile("rb").readline()))
