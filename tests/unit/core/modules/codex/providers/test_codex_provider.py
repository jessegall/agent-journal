from pathlib import Path

from core.modules.codex.providers.codex_provider import CodexProvider
from engine.provider.managed_hook import ManagedHook
from engine.provider.program_hooks import ProgramHooks


def test_the_journals_session_end_entry_is_capped_even_with_a_600_second_project_hook(tmp_path: Path):
    managed = [ManagedHook.found("codex", "SessionEnd", "", {"command": "cleanup", "timeout": 600}, ".codex/hooks.json", False, 600)]
    blocks = ProgramHooks.journal(CodexProvider, tmp_path / "hooks.json").journal_blocks("journal-hook", Path("/p"), managed)
    assert blocks["SessionEnd"][0]["hooks"][0]["timeout"] == 3
