from pathlib import Path

from core.modules.claude_code.providers.claude_code_provider import COMPACTION_INSTRUCTIONS, ClaudeCodeProvider
from engine.provider.managed_hook import ManagedHook
from engine.provider.program_hooks import ProgramHooks


def test_the_journals_session_end_entry_is_capped_even_with_a_600_second_project_hook(tmp_path: Path):
    managed = [ManagedHook.found("claude", "SessionEnd", "", {"command": "cleanup", "timeout": 600}, ".claude/settings.json", False, 600)]
    blocks = ProgramHooks.journal(ClaudeCodeProvider, tmp_path / "settings.json").journal_blocks("journal-hook", Path("/p"), managed)
    assert blocks["SessionEnd"][0]["hooks"][0]["timeout"] == 60


def test_the_compact_control_types_a_plain_compact_line():
    lines = [choice.line for group in ClaudeCodeProvider.controls if group.key == "context" for choice in group.choices if choice.value == "compact"]
    assert lines == ["/compact"]


def test_the_provider_carries_the_compaction_instructions():
    assert ClaudeCodeProvider.compaction_instructions == COMPACTION_INSTRUCTIONS
    assert COMPACTION_INSTRUCTIONS.startswith("Focus on continuing the work at once") and not COMPACTION_INSTRUCTIONS.startswith("/")


def test_the_instructions_fit_in_10000_characters():
    assert len(ClaudeCodeProvider.compaction_instructions) < 10_000
