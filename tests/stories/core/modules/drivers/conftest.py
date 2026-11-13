import pytest

from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider


@pytest.fixture(autouse=True)
def program_without_its_own_window(monkeypatch):
    """The stories of the compaction line the journal types at a stop are of a program that does not compact by its
    own window; Claude does, and its stop types nothing."""
    monkeypatch.setattr(ClaudeCodeProvider, "has_windowed_compaction", False)
