import json
from core.modules.claude_code.support.claude_code_settings import DEFAULT_MODEL_EFFORTS
from engine.provider.model_efforts import ModelEfforts
from pathlib import Path

import pytest

from engine.enums.hook_trust import HookTrust
from engine.provider.program_hooks import ProgramHooks

from engine.errors.refusal import Refusal

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
SETTINGS = ["--settings", str(ROOT / ".journal" / "programs" / "claude" / "settings.json"), "--setting-sources", "project",
            "--mcp-config", str(ROOT / ".journal" / "programs" / "claude" / "mcp.json")]


@pytest.fixture
def provider(tmp_path: Path) -> ClaudeCodeProvider:
    return ClaudeCodeProvider(ProgramFolders(), ServerKeys(PrivateFolder(JournalHome(tmp_path / ".journal"))), ModelEfforts(EffortSettings()))


def test_a_session_runs_claude_with_its_model_and_its_new_session_id(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "sonnet", "launch-1", SessionStart("s-1"), VARIABLES))
    assert (list(command.arguments), command.folder, dict(command.variables), command.session) == (
        ["claude", *SETTINGS, "--model", "sonnet", "--effort", "high", "--dangerously-skip-permissions", "--session-id", "s-1"], FOLDER, VARIABLES, "s-1")


def test_a_session_starts_on_opus_and_the_person_s_own_flags_win(provider):
    assert provider.session_model() == "opus"
    given = Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=("--model", "sonnet", "--effort=low"))
    assert list(provider.session_command(given).arguments) == ["claude", *SETTINGS, "--dangerously-skip-permissions", "--model", "sonnet", "--effort=low", "--session-id", "s-1"]
    effort_launch = Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=("--effort", "low"))
    assert list(provider.session_command(effort_launch).arguments) == ["claude", *SETTINGS, "--model", "opus", "--dangerously-skip-permissions", "--effort", "low", "--session-id", "s-1"]


def test_a_resumed_session_runs_claude_with_resume(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", ResumedSession("s-1"), VARIABLES))
    assert list(command.arguments)[-2:] == ["--resume", "s-1"]


def test_a_helper_runs_its_brief_without_a_terminal_and_prints_stream_json(provider):
    command = provider.helper_command(HelperLaunch(ROOT, FOLDER, "sonnet", "worker-7", SessionStart("s-2"), VARIABLES, brief="Write the tests"))
    assert list(command.arguments) == ["claude", *SETTINGS, "-p", "Write the tests", "--model", "sonnet", "--effort", "high", "--dangerously-skip-permissions", "--output-format",
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


def test_a_prepared_folder_gets_no_hook_file_of_the_journal(provider, tmp_path):
    provider.folder_prepared(tmp_path, tmp_path, '"/p/.journal/bin/journal-hook"')
    assert not (tmp_path / ".claude" / "settings.local.json").exists()


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


def test_a_session_command_carries_the_journal_settings_and_the_project_source(provider):
    arguments = list(provider.session_command(Launch(ROOT, FOLDER, "sonnet", "launch-1", SessionStart("s-1"), VARIABLES)).arguments)
    assert arguments[1:7] == SETTINGS
    assert Path(arguments[2]).is_absolute()
    assert "user" not in arguments and "local" not in arguments


def test_a_helper_command_carries_the_journal_settings_and_the_project_source(provider):
    arguments = list(provider.helper_command(HelperLaunch(ROOT, FOLDER, "sonnet", "worker-7", SessionStart("s-2"), VARIABLES, brief="Go")).arguments)
    assert arguments[1:7] == SETTINGS


@pytest.mark.parametrize("given", [("--settings", "/tmp/mine.json"), tuple(["--settings=/tmp/mine.json"])])
def test_a_person_settings_flag_is_refused(provider, given):
    with pytest.raises(Refusal, match="the journal launches Claude Code on its own settings; --settings and --setting-sources cannot be passed"):
        provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=given))


@pytest.mark.parametrize("given", [("--setting-sources", "user,project"), tuple(["--setting-sources=user"])])
def test_a_person_setting_sources_flag_is_refused(provider, given):
    with pytest.raises(Refusal, match="--settings and --setting-sources cannot be passed") as refusal:
        provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, program_arguments=given))
    assert refusal.value.suggestion == "launch without them: the journal writes the settings itself"


def test_ask_prompts_gives_permission_mode_default(provider):
    arguments = list(provider.session_command(Launch(ROOT, FOLDER, "opus", "launch-1", SessionStart("s-1"), VARIABLES, skip_prompts=False)).arguments)
    assert "--dangerously-skip-permissions" not in arguments
    assert arguments[arguments.index("--permission-mode") + 1] == "default"


def test_hook_trust_is_ready_when_the_journal_file_holds_every_event(provider, tmp_path):
    home = JournalHome(tmp_path / ".journal")
    ProgramHooks.journal(ClaudeCodeProvider, provider.journal_hook_file(home)).write("journal-hook", tmp_path)
    assert provider.journal_hook_file(home) == tmp_path / ".journal" / "programs" / "claude" / "settings.json"
    assert provider.journal_trust(home) is HookTrust.READY


def test_hook_trust_is_unwritten_when_only_the_local_project_file_holds_them(provider, tmp_path):
    ProgramHooks.hooks(ClaudeCodeProvider, tmp_path).write("journal-hook", tmp_path)
    assert provider.journal_trust(JournalHome(tmp_path / ".journal")) is HookTrust.UNWRITTEN


def test_a_compact_window_is_held_between_the_sizes_claude_accepts(tmp_path):
    from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
    from engine.enums.agent_setting import AgentSetting
    import json
    provider = ClaudeCodeProvider.__new__(ClaudeCodeProvider)
    provider.change_agent_setting(tmp_path, AgentSetting.COMPACT_WINDOW, 5_000)
    assert json.loads((tmp_path / ".claude" / "settings.json").read_text())["autoCompactWindow"] == 100_000
    provider.change_agent_setting(tmp_path, AgentSetting.COMPACT_WINDOW, 9_000_000)
    assert json.loads((tmp_path / ".claude" / "settings.json").read_text())["autoCompactWindow"] == 1_000_000
