import json
from types import SimpleNamespace

import pytest

from core.base.driver.foreign_answer import ForeignAnswer
from core.base.driver.foreign_run import ForeignRun
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.refusal_style import RefusalStyle

CLAUDE_PROVIDER = SimpleNamespace(refusals={HookEventName.PRE_TOOL_USE: RefusalStyle.DENY, HookEventName.STOP: RefusalStyle.BLOCK})
CODEX_PROVIDER = SimpleNamespace(refusals={HookEventName.STOP: RefusalStyle.BLOCK})


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
@pytest.mark.parametrize("fields,expected", [
    ({"hookSpecificOutput": {"additionalContext": "first\nsecond"}}, ("first", "second")),
    ({"hookSpecificOutput": {"permissionDecision": "allow"}}, ()),
])
def test_context_and_allow(provider, fields, expected):
    answer = ForeignAnswer.read(provider, HookEventName.PRE_TOOL_USE, ForeignRun("check", 0, json.dumps(fields), "", 1, False))
    assert answer.lines == expected
    assert answer.refusal == ""
    assert answer.updated_input == {}
    assert answer.terminal == ""


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
def test_rewritten_input(provider):
    fields = {"hookSpecificOutput": {"permissionDecision": "allow", "updatedInput": {"command": "safe"}}}
    answer = ForeignAnswer.read(provider, HookEventName.PRE_TOOL_USE, ForeignRun("check", 0, json.dumps(fields), "", 1, False))
    assert answer.updated_input == {"command": "safe"}
    assert answer.refusal == ""


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
def test_block_uses_the_event_refusal_style(provider):
    run = ForeignRun("check", 0, '{"decision":"block","reason":"stay"}', "", 1, False)
    assert ForeignAnswer.read(provider, HookEventName.STOP, run).reason() == "check: stay"
    assert ForeignAnswer.read(provider, HookEventName.SESSION_START, run).refusal == ""


def test_deny_uses_the_event_refusal_style():
    run = ForeignRun("check", 0, '{"hookSpecificOutput":{"permissionDecision":"deny","permissionDecisionReason":"unsafe"}}', "", 1, False)
    assert ForeignAnswer.read(CLAUDE_PROVIDER, HookEventName.PRE_TOOL_USE, run).reason() == "check: unsafe"
    assert ForeignAnswer.read(CODEX_PROVIDER, HookEventName.PRE_TOOL_USE, run).refusal == ""


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
@pytest.mark.parametrize("exit_code,timed_out", [(2, False), (7, False), (-1, False), (2, True)])
def test_process_failure_and_exit_two(provider, exit_code, timed_out):
    run = ForeignRun("check", exit_code, '{"decision":"block","reason":"ignored"}', "failure", 1, timed_out)
    answer = ForeignAnswer.read(provider, HookEventName.STOP, run)
    assert answer.refusal == ("failure" if exit_code == 2 and not timed_out else "")
    assert bool(answer.terminal) == (exit_code != 2 or timed_out)
    assert answer.lines == ()
    assert answer.updated_input == {}


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
def test_ask_and_system_message(provider):
    run = ForeignRun("check", 0, '{"systemMessage":"notice","hookSpecificOutput":{"permissionDecision":"ask","additionalContext":"ignored","updatedInput":{"command":"ignored"}}}', "", 1, False)
    answer = ForeignAnswer.read(provider, HookEventName.PRE_TOOL_USE, run)
    assert answer.refusal == ""
    assert "notice" in answer.terminal
    assert "cannot ask" in answer.terminal
    assert answer.lines == ()
    assert answer.updated_input == {}


@pytest.mark.parametrize("provider", [CLAUDE_PROVIDER, CODEX_PROVIDER])
def test_system_message(provider):
    answer = ForeignAnswer.read(provider, HookEventName.STOP, ForeignRun("check", 0, '{"systemMessage":"notice"}', "", 1, False))
    assert answer.terminal == "notice"
    assert answer.refusal == ""


@pytest.mark.parametrize("stdout", ["", "broken", "[]", '{"hookSpecificOutput":null}'])
def test_malformed_or_empty_output_never_refuses(stdout):
    answer = ForeignAnswer.read(CLAUDE_PROVIDER, HookEventName.STOP, ForeignRun("check", 0, stdout, "", 1, False))
    assert answer.refusal == ""
    assert answer.updated_input == {}
