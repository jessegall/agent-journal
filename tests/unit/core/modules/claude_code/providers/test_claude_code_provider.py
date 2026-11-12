import json
from core.modules.claude_code.support.claude_code_settings import DEFAULT_MODEL_EFFORTS
from engine.provider.model_efforts import ModelEfforts
from pathlib import Path

import pytest

from engine.provider.session_line import SessionLine
from engine.driver.hook_event import HookEvent
from engine.provider.helper_launch import HelperLaunch
from engine.provider.launch import Launch
from engine.journal.journal_home import JournalHome
from engine.provider.program_folders import ProgramFolders
from engine.provider.resumed_session import ResumedSession
from engine.provider.session_start import SessionStart
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from core.modules.claude_code.providers.claude_code_provider import CONFIG_VARIABLE, ClaudeCodeProvider
from core.modules.claude_code.providers.support.claude_folder_name import ClaudeFolderName



class EffortSettings:
    """The Claude Code effort entries as shipped."""

    def texts(self, key: str) -> tuple[str, ...]:
        return DEFAULT_MODEL_EFFORTS

def test_project_hook_files_include_shared_and_local_settings():
    assert ClaudeCodeProvider.hook_files == (Path(".claude/settings.json"), Path(".claude/settings.local.json"))

HOOK_FOLDER = Path(__file__).resolve().parents[6] / "tools" / "journal-hook"
RECORDED = HOOK_FOLDER / "testdata" / "recorded" / "claude"
PREPARED = HOOK_FOLDER / "programs" / "testdata" / "prepared" / "claude"
STOP_EXAMPLE = HOOK_FOLDER / "event" / "testdata" / "schema" / "stop.json"
ROOT, FOLDER = Path("/work/journal"), Path("/work/app")
VARIABLES = {"JOURNAL_ENV": "main"}


@pytest.fixture
def provider(tmp_path: Path) -> ClaudeCodeProvider:
    return ClaudeCodeProvider(ProgramFolders(), ServerKeys(PrivateFolder(JournalHome(tmp_path / ".journal"))), ModelEfforts(EffortSettings()))


def test_a_session_runs_claude_with_its_model_and_its_new_session_id(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "sonnet", "launch-1", SessionStart("s-1"), VARIABLES))
    assert (list(command.arguments), command.folder, dict(command.variables), command.session) == (
        ["claude", "--model", "sonnet", "--effort", "high", "--dangerously-skip-permissions", "--session-id", "s-1"], FOLDER, VARIABLES, "s-1")


def test_a_session_starts_on_opus_and_the_person_s_own_flags_win(provider):
    assert provider.session_model() == "opus"
    given = Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=("--model", "sonnet", "--effort=low"))
    assert list(provider.session_command(given).arguments) == ["claude", "--dangerously-skip-permissions", "--model", "sonnet", "--effort=low", "--session-id", "s-1"]
    effort_launch = Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=("--effort", "low"))
    assert list(provider.session_command(effort_launch).arguments) == ["claude", "--model", "opus", "--dangerously-skip-permissions", "--effort", "low", "--session-id", "s-1"]


def test_a_resumed_session_runs_claude_with_resume(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", ResumedSession("s-1"), VARIABLES))
    assert list(command.arguments)[-2:] == ["--resume", "s-1"]


def test_a_helper_runs_its_brief_without_a_terminal_and_prints_stream_json(provider):
    command = provider.helper_command(HelperLaunch(ROOT, FOLDER, "sonnet", "worker-7", SessionStart("s-2"), VARIABLES, brief="Write the tests"))
    assert list(command.arguments) == ["claude", "-p", "Write the tests", "--model", "sonnet", "--effort", "high", "--dangerously-skip-permissions", "--output-format",
                                       "stream-json", "--verbose", "--session-id", "s-2"]


def test_a_sessions_transcript_is_found_under_the_config_folder(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-app" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("{}\n")
    assert (provider.transcript(FOLDER, "s-1"), provider.transcript(FOLDER, "s-9")) == (transcript, None)


def test_every_recorded_hook_name_is_mapped_to_the_event_the_go_program_prepared(provider):
    pairs = [(json.loads(body)["hook_event_name"], json.loads(prepared)["event"]) for path in sorted(RECORDED.glob("*.jsonl"))
             for body, prepared in zip(path.read_text().splitlines(), (PREPARED / path.name).read_text().splitlines(), strict=True) if prepared != "skip"]
    assert len(pairs) > 1000 and all(provider.hook_events[name] == event for name, event in pairs)


def test_a_line_for_a_session_with_no_registry_entry_under_the_config_folder_waits(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    (tmp_path / "claude" / "sessions").mkdir(parents=True)
    assert provider.delivered_line(SessionLine("s-1", "the journal", "log your task")) is False


def test_the_context_percent_is_read_from_the_file_the_status_line_keeps_for_the_session(provider, tmp_path):
    home = JournalHome(tmp_path)
    home.status_folder.mkdir(parents=True)
    (home.status_folder / "s-1.json").write_text(json.dumps({"session_id": "s-1", "context_window": {"used_percentage": 55.6}}))
    assert (provider.context_percent(home, "s-1"), provider.context_percent(home, "s-2")) == (55, None)


def test_the_hook_file_runs_the_hook_program_as_the_status_line(provider, tmp_path):
    provider.folder_prepared(tmp_path, tmp_path, '"/p/.journal/bin/journal-hook"')
    settings = json.loads((tmp_path / ".claude" / "settings.local.json").read_text())
    assert settings["statusLine"] == {"type": "command", "command": f'"/p/.journal/bin/journal-hook" --status "{tmp_path}"', "padding": 0}
    assert settings["autoMemoryEnabled"] is False


def test_a_session_found_under_another_project_does_not_resume_here(provider, tmp_path, monkeypatch):
    monkeypatch.setenv(CONFIG_VARIABLE, str(tmp_path))
    project, session_folder = tmp_path / "project", tmp_path / "session-project"
    transcript = tmp_path / "projects" / ClaudeFolderName.folder_name(session_folder) / "thread.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("{}\n")
    assert provider.transcript(project, "thread") == transcript
    assert not provider.session_matches_folder(project, "thread")
    assert provider.session_matches_folder(session_folder, "thread")



def test_opus_starts_at_medium_and_sonnet_at_high_by_default():
    provider = ClaudeCodeProvider(ProgramFolders(), None, ModelEfforts(EffortSettings()))
    assert (provider.effort("claude-opus-5-5"), provider.effort("opus"), provider.effort("sonnet"), provider.effort("haiku")) == ("medium", "medium", "high", "high")
