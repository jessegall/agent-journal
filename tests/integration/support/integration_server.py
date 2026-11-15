from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path

from engine.testing.examples.hook_samples import HookSamples
from server.context.server_context import ServerContext
from tests.integration.support.integration_journal import IntegrationJournal
from tests.integration.support.server_client import DirectRun, ServerClient
from tests.integration.support.server_harness import ServerAnswer, running_server


class IntegrationServer(ServerClient):
    """The real server running on an integration journal, asked through its socket as a client asks it."""

    def __init__(self, journal: IntegrationJournal, socket_path: Path, context: ServerContext) -> None:
        super().__init__(socket_path, context, journal.home)
        self.journal = journal

    def direct_run(self, line: str) -> DirectRun:
        answer = self.journal.run(line)
        return DirectRun(answer.code, answer.text)

    # a main agent starts as Claude Code starts one: its session_start hook reaches the server
    def start_agent(self, session: str) -> ServerAnswer:
        answer = self.request("POST", "/hook", dict(HookSamples.session_start().with_fields(session=session, event_id=f"start-{session}").body))
        assert answer.status == 200, answer
        return answer

    # a main agent that read its overview and holds a started task it has read, ready to edit and run lines
    def start_agent_on_task(self, session: str, title: str = "Sort the cart") -> None:
        self.start_agent(session)
        for line in ("overview", f'task make "{title}" --brief "A task in hand"', "task start 1", "task overview 1"):
            answer = self.run_as(line, session)
            assert answer.exit_code == 0, (line, answer)


@contextmanager
def integration_server(journal: IntegrationJournal, **options) -> Generator[IntegrationServer]:
    with running_server(journal.home, **options) as (_, socket_path, context):
        yield IntegrationServer(journal, socket_path, context)
