import json
from pathlib import Path

import pytest

from engine.provider.session_line import SessionLine
from engine.provider.helper_launch import HelperLaunch
from engine.provider.launch import Launch
from engine.journal.journal_home import JournalHome
from engine.provider.program_folders import ProgramFolders
from engine.provider.program_hooks import ProgramHooks
from engine.provider.resumed_session import ResumedSession
from engine.provider.session_start import SessionStart
from engine.private.private_folder import PrivateFolder
from engine.private.server_keys import ServerKeys
from core.modules.codex.providers.codex_provider import CodexProvider
from engine.provider.model_efforts import ModelEfforts


class EffortSettings:
    """The Codex effort entries a user set."""

    def __init__(self, *entries: str) -> None:
        self.entries = entries

    def texts(self, key: str) -> tuple[str, ...]:
        return self.entries


def test_project_hook_files_include_codex_hooks():
    assert CodexProvider.hook_files == tuple([Path(".codex/hooks.json")])

HOOK_FOLDER = Path(__file__).resolve().parents[6] / "tools" / "journal-hook"
RECORDED = HOOK_FOLDER / "testdata" / "recorded" / "codex"
PREPARED = HOOK_FOLDER / "programs" / "testdata" / "prepared" / "codex"
ROOT, FOLDER = Path("/work/journal"), Path("/work/app")
VARIABLES = {"JOURNAL_ENV": "main"}


@pytest.fixture
def provider(tmp_path: Path) -> CodexProvider:
    return CodexProvider(ProgramFolders(), ServerKeys(PrivateFolder(JournalHome(tmp_path / ".journal"))), ModelEfforts(EffortSettings()))


def test_a_session_runs_codex_with_its_model_and_names_no_session_of_its_own(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", SessionStart(""), VARIABLES))
    assert (list(command.arguments), command.session) == (["codex", "--no-daemon", "-m", "gpt-6.1-sol", "--dangerously-bypass-approvals-and-sandbox"], None)


def test_a_resumed_session_runs_codex_resume_with_its_session(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", ResumedSession("t-1"), VARIABLES))
    assert list(command.arguments)[-2:] == ["resume", "t-1"]


def test_a_resumed_helper_puts_resume_right_after_exec(provider):
    command = provider.helper_command(HelperLaunch(ROOT, FOLDER, "gpt-6.1-sol", "worker-7", ResumedSession("t-2"), VARIABLES, brief="Write the tests"))
    assert list(command.arguments) == ["codex", "exec", "resume", "t-2", "--json", "--dangerously-bypass-approvals-and-sandbox", "--dangerously-bypass-hook-trust",
                                       "-m", "gpt-6.1-sol", "Write the tests"]


def test_hook_options_are_written_only_for_events_that_support_them(tmp_path):
    ProgramHooks.hooks(CodexProvider, tmp_path).write("journal-hook", tmp_path)
    hooks = json.loads((tmp_path / ".codex/hooks.json").read_text())["hooks"]
    entries = {event: blocks[0]["hooks"][0] for event, blocks in hooks.items()}
    assert {event for event, entry in entries.items() if entry.get("additionalContextLimit") == 0} == {
        "SessionStart", "UserPromptSubmit", "PreToolUse", "PostToolUse",
    }
    assert entries["SessionEnd"]["timeout"] == 3
    assert all(entry["timeout"] == 90 for event, entry in entries.items() if event != "SessionEnd")


def test_a_helpers_outcome_is_its_last_reply_its_thread_and_its_last_failure(provider):
    output = "\n".join(json.dumps(line) for line in [{"type": "thread.started", "thread_id": "t-9"},
                                                       {"type": "item.completed", "item": {"type": "agent_message", "text": "first"}},
                                                       {"type": "item.completed", "item": {"type": "agent_message", "text": "Done: tests pass"}},
                                                       {"type": "turn.failed", "error": {"message": "rate limited"}}])
    outcome = provider.helper_outcome(output, "")
    assert (outcome.report, outcome.session, outcome.error) == ("Done: tests pass", "t-9", "rate limited")


def test_a_sessions_rollout_is_found_under_the_codex_home(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    rollout = tmp_path / "codex" / "sessions" / "2026" / "10" / "31" / "rollout-2026-10-31T09-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text("{}\n")
    assert (provider.transcript(FOLDER, "t-1"), provider.transcript(FOLDER, "t-9")) == (rollout, None)


def test_the_context_percent_is_read_from_the_end_of_a_rollout_longer_than_the_tail(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    rollout = tmp_path / "codex" / "sessions" / "2026" / "10" / "31" / "rollout-2026-10-31T09-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    count = {"payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 50}, "model_context_window": 100}}}
    filler = json.dumps({"payload": {"role": "user", "content": [{"text": "x" * 1000}]}})
    rollout.write_text(json.dumps(count) + "\n" + "\n".join([filler] * 400) + "\n" + json.dumps({**count, "payload": {**count["payload"], "info": {**count["payload"]["info"], "last_token_usage": {"total_tokens": 70}}}}) + "\n")
    assert provider.context_percent(JournalHome(tmp_path / ".journal"), "t-1") == 70


def test_every_recorded_hook_name_is_mapped_to_the_event_the_go_program_prepared(provider):
    pairs = [(json.loads(body)["hook_event_name"], json.loads(prepared)["event"]) for path in sorted(RECORDED.glob("*.jsonl"))
             for body, prepared in zip(path.read_text().splitlines(), (PREPARED / path.name).read_text().splitlines(), strict=True) if prepared != "skip"]
    assert len(pairs) > 10 and all(provider.hook_events[name] == event for name, event in pairs)


def test_codex_takes_no_line_while_it_runs_so_the_line_waits_for_the_next_hook(provider):
    assert provider.delivered_line(SessionLine("t-1", "the journal", "log your task")) is False


def test_the_context_percent_is_the_last_token_count_of_the_sessions_rollout(provider, tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    rollout = tmp_path / "codex" / "sessions" / "2026" / "10" / "31" / "rollout-2026-10-31T09-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    counts = [{"type": "event_msg", "payload": {"type": "token_count", "info": {"model_context_window": 200000, "last_token_usage": {"total_tokens": tokens}}}} for tokens in (20000, 50000)]
    rollout.write_text("".join(json.dumps(row) + "\n" for row in counts))
    assert (provider.context_percent(JournalHome(tmp_path), "t-1"), provider.context_percent(JournalHome(tmp_path), "t-2")) == (25, None)


def test_a_session_resumes_only_in_the_folder_it_started_in(provider, tmp_path, monkeypatch):
    project = tmp_path / "project"
    rollout = tmp_path / "rollout-thread.jsonl"
    rollout.write_text(json.dumps({"type": "session_meta", "payload": {"cwd": str(project)}}) + "\n")
    monkeypatch.setattr(provider, "transcript", lambda _project, session: rollout if session == "thread" else None)
    assert provider.session_matches_folder(project, "thread")
    assert not provider.session_matches_folder(tmp_path / "other", "thread")
    assert not provider.session_matches_folder(project, "launch-name-only")


def test_a_model_with_an_effort_entry_starts_at_it_and_a_launch_that_names_one_keeps_its_own(tmp_path):
    provider = CodexProvider(ProgramFolders(), ServerKeys(PrivateFolder(JournalHome(tmp_path / ".journal"))), ModelEfforts(EffortSettings("sol:high")))
    session = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", ResumedSession("t-1"), VARIABLES))
    named = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-2", ResumedSession("t-1"), VARIABLES, effort="low"))
    helper = provider.helper_command(HelperLaunch(ROOT, FOLDER, "gpt-6.1-sol", "worker-7", ResumedSession("t-2"), VARIABLES, brief="Write the tests"))
    different = provider.helper_command(HelperLaunch(ROOT, FOLDER, "gpt-6.1-mini", "worker-8", ResumedSession("t-3"), VARIABLES, brief="Write the tests"))
    efforts = [[argument for argument in command.arguments if "model_reasoning_effort" in argument] for command in (session, named, helper, different)]
    assert efforts == [["model_reasoning_effort=high"], [], ["model_reasoning_effort=high"], []]


JOURNAL_CODEX_HOME = str(ROOT / ".journal" / "programs" / "codex")


def test_a_session_command_sets_the_journal_codex_home(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", SessionStart(""), VARIABLES))
    assert command.variables["CODEX_HOME"] == JOURNAL_CODEX_HOME
    assert command.variables["JOURNAL_ENV"] == "main"


def test_a_helper_command_sets_the_journal_codex_home(provider):
    command = provider.helper_command(HelperLaunch(ROOT, FOLDER, "gpt-6.1-sol", "worker-7", SessionStart(""), VARIABLES, brief="Go"))
    assert command.variables["CODEX_HOME"] == JOURNAL_CODEX_HOME


def test_the_journal_codex_home_wins_over_a_launch_variable(provider):
    command = provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", SessionStart(""), {"CODEX_HOME": "/Users/someone/.codex"}))
    assert command.variables["CODEX_HOME"] == JOURNAL_CODEX_HOME


def test_ask_prompts_asks_for_approval_on_request_in_a_writable_workspace(provider):
    arguments = list(provider.session_command(Launch(ROOT, FOLDER, "gpt-6.1-sol", "launch-1", SessionStart(""), VARIABLES, skip_prompts=False)).arguments)
    assert "--dangerously-bypass-approvals-and-sandbox" not in arguments
    assert ["-c", 'approval_policy="on-request"', "-c", 'sandbox_mode="workspace-write"'] == arguments[arguments.index('approval_policy="on-request"') - 1:arguments.index('approval_policy="on-request"') + 3]
