import json
from pathlib import Path

import pytest

from core.base.provider.session_line import SessionLine
from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch import Launch
from core.base.provider.program_folders import ProgramFolders
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.codex.providers.codex_provider import CodexProvider

HOOK_FOLDER = Path(__file__).resolve().parents[6] / "tools" / "journal-hook"
RECORDED = HOOK_FOLDER / "testdata" / "recorded" / "codex"
PREPARED = HOOK_FOLDER / "programs" / "testdata" / "prepared" / "codex"
ROOT, FOLDER = Path("/work/journal"), Path("/work/app")
VARIABLES = {"JOURNAL_ENV": "main"}


@pytest.fixture
def provider() -> CodexProvider:
    return CodexProvider(ProgramFolders())


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


def test_the_hook_file_asks_for_no_limit_on_added_context(provider):
    assert (provider.hook_file.path, dict(provider.hook_file.entry_values)) == (Path(".codex/hooks.json"), {"additionalContextLimit": 0})


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


def test_every_recorded_hook_name_is_mapped_to_the_event_the_go_program_prepared(provider):
    pairs = [(json.loads(body)["hook_event_name"], json.loads(prepared)["event"]) for path in sorted(RECORDED.glob("*.jsonl"))
             for body, prepared in zip(path.read_text().splitlines(), (PREPARED / path.name).read_text().splitlines(), strict=True)]
    assert len(pairs) > 10 and all(provider.hook_events[name] == event for name, event in pairs)


def test_codex_takes_no_line_while_it_runs_so_the_line_waits_for_the_next_hook(provider):
    assert provider.line_sent(SessionLine("t-1", "the journal", "log your task")) is False
