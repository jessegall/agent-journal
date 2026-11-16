import json
from pathlib import Path

from engine.provider.enums.matcher_style import MatcherStyle
from engine.provider.program_row import ProgramRow
from tests.unit.engine.samples.program_sample import SampleProgram

SHIPPED_TABLE = Path(__file__).resolve().parents[4] / "tools" / "journal-hook" / "programs" / "programs.json"


def test_the_row_carries_the_matcher_style_and_the_limits(monkeypatch):
    row = ProgramRow.row(SampleProgram)
    assert (row.matcher_style, row.default_hook_seconds, row.session_end_limit_seconds) == ("regex", 600, 3)
    monkeypatch.setattr(SampleProgram, "matcher_style", MatcherStyle.NAMES_OR_REGEX)
    monkeypatch.setattr(SampleProgram, "session_end_limit_seconds", 60)
    row = ProgramRow.row(SampleProgram)
    assert (row.matcher_style, row.session_end_limit_seconds) == ("names_or_regex", 60)


def test_claude_reads_names_or_regex_and_codex_reads_regex():
    programs = json.loads(SHIPPED_TABLE.read_text())["programs"]
    assert {name: (program["matcher_style"], program["default_hook_seconds"], program["session_end_limit_seconds"])
            for name, program in programs.items()} == {"claude": ("names_or_regex", 600, 60), "codex": ("regex", 600, 3)}


def bundled_fields(name: str, field: str) -> set[str]:
    return set(json.loads(SHIPPED_TABLE.read_text())["programs"][name][field])


def test_claude_honours_if_args_shell_async_async_rewake_and_on_failure():
    assert {"if", "args", "shell", "async", "asyncRewake", "onFailure"} <= bundled_fields("claude", "entry_fields")


def test_codex_honours_only_async():
    assert bundled_fields("codex", "entry_fields") == {"async"}


def test_the_output_fields_differ_by_program():
    assert bundled_fields("codex", "output_fields") == {"continue", "stopReason"}
    assert {"updatedToolOutput", "suppressOriginalPrompt", "sessionTitle", "terminalSequence"} <= bundled_fields("claude", "output_fields")
