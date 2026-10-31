import os
from server.server_context import ServerContext
from server.endpoints.health import Health


class HealthEndpoint:
    """Answers GET /health."""

    def __init__(self, context: ServerContext) -> None:
        self.context = context

    def answer(self) -> Health:
        return Health("ok", os.getpid(), self.context.code_version.text, self.context.started_at.text, self.context.viewer.port)
