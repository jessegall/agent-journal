import json
from pathlib import Path

import pytest

from core.base.provider.session_line import SessionLine
from core.base.driver.hook_event import HookEvent
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch import Launch
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider

HOOK_FOLDER = Path(__file__).resolve().parents[6] / "tools" / "journal-hook"
RECORDED = HOOK_FOLDER / "testdata" / "recorded" / "claude"
PREPARED = HOOK_FOLDER / "programs" / "testdata" / "prepared" / "claude"
STOP_EXAMPLE = HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json"
ROOT, FOLDER = Path("/work/journal"), Path("/work/app")
VARIABLES = {"JOURNAL_ENV": "main"}


@pytest.fixture
def provider() -> ClaudeCodeProvider:
    return ClaudeCodeProvider(ProgramFolders())


def test_a_session_runs_claude_with_its_model_and_its_new_session_id(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "sonnet", "launch-1", SessionStart("s-1"), VARIABLES))
    assert (list(command.arguments), command.folder, dict(command.variables), command.session) == (
        ["claude", "--model", "sonnet", "--dangerously-skip-permissions", "--session-id", "s-1"], FOLDER, VARIABLES, "s-1")


def test_a_resumed_session_runs_claude_with_resume(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", ResumedSession("s-1"), VARIABLES))
    assert list(command.arguments)[-2:] == ["--resume", "s-1"]


def test_a_helper_runs_its_brief_without_a_terminal_and_prints_stream_json(provider):
    command = provider.helper_command(HelperLaunch(ROOT, FOLDER, "sonnet", "worker-7", SessionStart("s-2"), VARIABLES, brief="Write the tests"))
    assert list(command.arguments) == ["claude", "-p", "Write the tests", "--model", "sonnet", "--dangerously-skip-permissions", "--output-format",
                                       "stream-json", "--verbose", "--session-id", "s-2"]


def test_a_sessions_transcript_is_found_under_the_config_folder(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-app" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("{}\n")
    assert (provider.transcript(FOLDER, "s-1"), provider.transcript(FOLDER, "s-9")) == (transcript, None)


def test_a_subagents_hook_names_the_subagents_own_transcript(provider):
    example = json.loads(STOP_EXAMPLE.read_text())
    raw = {"transcript_path": "/talks/main.jsonl", "agent_transcript_path": "/talks/helper.jsonl"}
    main = HookEvent.parsed({**example, "raw": raw})
    helper = HookEvent.parsed({**example, "subagent": "a1", "raw": raw})
    assert (provider.transcript_path(main), provider.transcript_path(helper)) == (Path("/talks/main.jsonl"), Path("/talks/helper.jsonl"))


def test_every_recorded_hook_name_is_mapped_to_the_event_the_go_program_prepared(provider):
    pairs = [(json.loads(body)["hook_event_name"], json.loads(prepared)["event"]) for path in sorted(RECORDED.glob("*.jsonl"))
             for body, prepared in zip(path.read_text().splitlines(), (PREPARED / path.name).read_text().splitlines(), strict=True)]
    assert len(pairs) > 1000 and all(provider.hook_events[name] == event for name, event in pairs)


def test_a_line_for_a_session_with_no_registry_entry_under_the_config_folder_waits(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    (tmp_path / "claude" / "sessions").mkdir(parents=True)
    assert provider.line_sent(SessionLine("s-1", "the journal", "log your task")) is False
