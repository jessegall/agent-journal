import json
import socket

WAIT = 5.0
"""How long a supervisor has to answer a request."""


class SupervisorSocket:
    """One request to a supervisor on the protocol: a line of JSON out, a line back."""

    @staticmethod
    def ask(path: str, request: dict) -> dict:
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as link:
            link.settimeout(WAIT)
            link.connect(path)
            link.sendall((json.dumps(request) + "\n").encode())
            return json.loads(link.makefile("rb").readline())
