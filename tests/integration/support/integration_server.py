import shlex
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.testing.examples.hook_samples import HookSamples
from server.context.server_context import ServerContext
from tests.integration.support.integration_journal import IntegrationJournal
from tests.integration.support.server_harness import ServerAnswer, request_answer, running_server


class IntegrationServer:
    """The real server running on an integration journal, asked through its socket as a client asks it."""

    def __init__(self, journal: IntegrationJournal, socket_path: Path, context: ServerContext) -> None:
        self.journal = journal
        self.socket_path = socket_path
        self.context = context

    def request(self, method: str, route: str, body: object = None, headers: dict[str, str] | None = None) -> ServerAnswer:
        return request_answer(self.socket_path, method, route, body, headers)

    def run_as(self, line: str, session: str) -> ServerAnswer:
        return self.request("POST", "/cli", {"argv": shlex.split(line), "variables": {"JOURNAL_AGENT_SESSION": session}, "folder": "/"})

    def viewer_port(self) -> int:
        answer = self.request("GET", "/health").json()
        assert isinstance(answer, dict) and isinstance(answer["viewer_port"], int), answer
        return answer["viewer_port"]

    # a main agent starts as Claude Code starts one: its session_start hook reaches the server
    def start_agent(self, session: str) -> ServerAnswer:
        answer = self.request("POST", "/hook", dict(HookSamples.session_start().with_fields(session=session).body))
        assert answer.status == 200, answer
        return answer


@contextmanager
def integration_server(journal: IntegrationJournal, **options) -> Generator[IntegrationServer]:
    with running_server(journal.home, **options) as (_, socket_path, context):
        yield IntegrationServer(journal, socket_path, context)
