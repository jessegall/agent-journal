import os
from dataclasses import dataclass

from server.journal_server import ServerContext


@dataclass(frozen=True)
class Health:
    """What GET /health answers: the server is up, with its pid, the code it runs, when it started and the port
    of its viewer."""

    status: str
    pid: int
    code_version: str
    started_at: str
    viewer_port: int


class HealthEndpoint:
    """Answers GET /health."""

    def __init__(self, context: ServerContext) -> None:
        self.context = context

    def answer(self) -> Health:
        return Health("ok", os.getpid(), self.context.code_version.text, self.context.started_at.text, self.context.viewer.port)
