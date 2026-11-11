from dataclasses import dataclass, replace
from types import SimpleNamespace

from core.modules.agents.commands.start_agent.start_agent_handler import StartAgentHandler

CONTEXT = SimpleNamespace(environment_id=1)
STARTED_AT = "2026-11-11T09:00:00"


@dataclass(frozen=True)
class FakeMainRow:
    """The fields of the main agent's row a new session changes."""

    id: int = 7
    session: str = "s-1"
    program: str = "claude"
    program_model: str = "opus"
    pid: int | None = 4242
    process_started_at: str | None = None
    ended_at: str | None = None


class FakeWrites:
    """Keeps what the handler and the dispatcher saved, which session was ended and which history row was asked for."""

    def __init__(self) -> None:
        self.saved: list[FakeMainRow] = []
        self.ended: list[FakeMainRow] = []
        self.history: list[FakeMainRow] = []

    def save(self, row: FakeMainRow, context: SimpleNamespace) -> FakeMainRow:
        self.saved.append(row)
        return row

    def record_process(self, row: FakeMainRow, process: SimpleNamespace, context: SimpleNamespace) -> FakeMainRow:
        return self.save(replace(row, ended_at=None, pid=process.pid, process_started_at=process.started_at), context)

    def ended_session(self, main: FakeMainRow, context: SimpleNamespace) -> FakeMainRow:
        self.ended.append(main)
        return FakeMainRow(id=main.id, session=main.session, program=main.program, program_model=main.program_model, pid=main.pid, ended_at=STARTED_AT)

    def started(self, agent: FakeMainRow, context: SimpleNamespace) -> None:
        self.history.append(agent)


def handler_with_writes() -> tuple[StartAgentHandler, FakeWrites]:
    writes = FakeWrites()
    chain = SimpleNamespace(start_timestamp=lambda pid: STARTED_AT)
    return StartAgentHandler(SimpleNamespace(), writes, chain, SimpleNamespace(), SimpleNamespace(), writes, SimpleNamespace(), writes, writes), writes


def codex_start() -> SimpleNamespace:
    return SimpleNamespace(session="s-2", program="codex", program_model="gpt", pid=None, process_started_at=None)


def test_a_main_start_over_a_running_session_ends_it_and_keeps_the_row():
    handler, writes = handler_with_writes()
    agent = handler.on_main_row(FakeMainRow(), codex_start(), CONTEXT)
    assert [row.session for row in writes.ended] == ["s-1"]
    assert (agent.id, agent.session, agent.program, agent.program_model, agent.pid, agent.ended_at) == (7, "s-2", "codex", "gpt", None, None)
    assert writes.saved == [agent] and writes.history == [agent]


def test_a_main_start_over_an_ended_session_ends_nothing_and_reopens_the_row():
    handler, writes = handler_with_writes()
    agent = handler.on_main_row(FakeMainRow(ended_at=STARTED_AT), codex_start(), CONTEXT)
    assert writes.ended == []
    assert (agent.id, agent.session, agent.ended_at) == (7, "s-2", None)
    assert writes.history == [agent]
