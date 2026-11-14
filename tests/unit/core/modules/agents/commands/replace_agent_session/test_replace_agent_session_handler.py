from types import SimpleNamespace

from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.commands.replace_agent_session.replace_agent_session_handler import ReplaceAgentSessionHandler
from core.modules.agents.models.enums.end_reason import EndReason

AGENT = SimpleNamespace(id=7, session="s-1", program="claude", program_model="sonnet")


class RecordingRepository:
    def __init__(self) -> None:
        self.changes: dict[str, object] = {}

    def update(self, row, context, **changes):
        self.changes = changes
        return SimpleNamespace(**{**vars(row), **changes})


class RecordingSessions:
    def __init__(self) -> None:
        self.replacements: list[tuple[str, EndReason]] = []

    def replaced(self, agent, reason, context) -> None:
        self.replacements.append((agent.session, reason))


def replaced(command: ReplaceAgentSession):
    repository, sessions = RecordingRepository(), RecordingSessions()
    agent = ReplaceAgentSessionHandler(SimpleNamespace(find=lambda row_id: AGENT), repository, sessions).handle(command, None)
    return agent, repository, sessions


def test_a_replacement_that_names_no_program_changes_only_the_session():
    agent, repository, sessions = replaced(ReplaceAgentSession(7, EndReason.CACHE_PASSED))
    assert sorted(repository.changes) == ["session"]
    assert (agent.id, agent.program, agent.program_model) == (7, "claude", "sonnet")
    assert agent.session != "s-1"
    assert sessions.replacements == [(agent.session, EndReason.CACHE_PASSED)]


def test_a_replacement_that_names_a_program_saves_the_program_and_its_model_with_the_session():
    agent, repository, sessions = replaced(ReplaceAgentSession(7, EndReason.LAUNCH_ROTATION, "codex", "gpt-6.1-terra"))
    assert (agent.program, agent.program_model) == ("codex", "gpt-6.1-terra")
    assert sessions.replacements == [(agent.session, EndReason.LAUNCH_ROTATION)]
