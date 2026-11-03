import json

import pytest

from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.foreign_run import ForeignRun
from core.base.driver.hook_event_name import HookEventName
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider
from core.modules.codex.providers.codex_provider import CodexProvider


@pytest.mark.parametrize("provider", [ClaudeCodeProvider, CodexProvider])
@pytest.mark.parametrize("fields,refusal,lines,updated_input,terminal", [
    ({"decision": "block", "reason": "stay"}, "stay", (), {}, ""),
    ({"hookSpecificOutput": {"additionalContext": "one\ntwo"}}, "", ("one", "two"), {}, ""),
    ({"hookSpecificOutput": {"updatedInput": {"command": "safe"}}}, "", (), {"command": "safe"}, ""),
    ({"hookSpecificOutput": {"permissionDecision": "allow"}}, "", (), {}, ""),
    ({"systemMessage": "notice"}, "", (), {}, "notice"),
])
def test_native_answers(provider, fields, refusal, lines, updated_input, terminal):
    answer = ForeignAnswer.read(provider, HookEventName.STOP, ForeignRun("check", 0, json.dumps(fields), "", 1, False))
    assert answer.refusal == refusal
    assert answer.lines == lines
    assert answer.updated_input == updated_input
    assert answer.terminal == terminal
    assert answer.name == "check"


def test_deny_respects_provider_and_event():
    run = ForeignRun("check", 0, '{"hookSpecificOutput":{"permissionDecision":"deny","permissionDecisionReason":"unsafe"}}', "", 1, False)
    assert ForeignAnswer.read(ClaudeCodeProvider, HookEventName.PRE_TOOL_USE, run).reason() == "check: unsafe"
    assert ForeignAnswer.read(CodexProvider, HookEventName.PRE_TOOL_USE, run).refusal == ""
    assert ForeignAnswer.read(ClaudeCodeProvider, HookEventName.SESSION_START, run).refusal == ""


@pytest.mark.parametrize("provider", [ClaudeCodeProvider, CodexProvider])
def test_block_respects_event(provider):
    run = ForeignRun("check", 0, '{"decision":"block","reason":"stay"}', "", 1, False)
    assert ForeignAnswer.read(provider, HookEventName.SESSION_START, run).refusal == ""


@pytest.mark.parametrize("provider", [ClaudeCodeProvider, CodexProvider])
@pytest.mark.parametrize("exit_code,timed_out", [(2, False), (7, False), (-1, False), (2, True)])
def test_process_outcomes(provider, exit_code, timed_out):
    run = ForeignRun("check", exit_code, '{"decision":"block","reason":"ignored"}', "failure", 1, timed_out)
    answer = ForeignAnswer.read(provider, HookEventName.STOP, run)
    assert answer.refusal == ("failure" if exit_code == 2 and not timed_out else "")
    assert bool(answer.terminal) == (exit_code != 2 or timed_out)
    assert answer.lines == ()
    assert answer.updated_input == {}


@pytest.mark.parametrize("provider", [ClaudeCodeProvider, CodexProvider])
def test_ask_gives_terminal_only(provider):
    run = ForeignRun("check", 0, '{"systemMessage":"notice","hookSpecificOutput":{"permissionDecision":"ask"}}', "", 1, False)
    answer = ForeignAnswer.read(provider, HookEventName.PRE_TOOL_USE, run)
    assert answer.refusal == ""
    assert "notice" in answer.terminal
    assert "cannot ask" in answer.terminal
    assert answer.lines == ()
    assert answer.updated_input == {}


@pytest.mark.parametrize("stdout", ["", "broken", "[]", '{"hookSpecificOutput":null}'])
def test_malformed_output_never_refuses(stdout):
    answer = ForeignAnswer.read(ClaudeCodeProvider, HookEventName.STOP, ForeignRun("check", 0, stdout, "", 1, False))
    assert answer.refusal == ""
    assert answer.updated_input == {}
