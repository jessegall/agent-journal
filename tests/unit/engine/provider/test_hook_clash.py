from types import SimpleNamespace

import pytest

from engine.enums.hook_event_name import HookEventName
from engine.enums.refusal_style import RefusalStyle
from engine.driver.driver_rule import DriverRule
from engine.enums.tool_type import ToolType
from engine.provider.enums.hook_effect import HookEffect
from engine.provider.managed_hook import ManagedHook


@pytest.mark.parametrize("event,matcher,expected", [
    (HookEventName.PRE_TOOL_USE, "Bash", ["can_refuse", "can_rewrite", "adds_lines"]),
    (HookEventName.PRE_TOOL_USE, "Edit", ["can_refuse", "adds_lines"]),
    (HookEventName.SESSION_START, "", ["adds_lines"]),
    (HookEventName.STOP, "", ["can_refuse"]),
    (HookEventName.SESSION_END, "", []),
])
def test_labels_follow_the_programs_event_capabilities(event, matcher, expected):
    provider = SimpleNamespace(refusals={HookEventName.PRE_TOOL_USE: RefusalStyle.DENY, HookEventName.STOP: RefusalStyle.BLOCK},
                               rewrites={HookEventName.PRE_TOOL_USE: {"run_in_background": False}},
                               line_events=[HookEventName.PRE_TOOL_USE, HookEventName.SESSION_START])
    hook = ManagedHook.found("sample", "NativeEvent", matcher, {"command": "check"}, "settings.json", False)
    assert HookEffect.detected(hook, provider, event) == expected


def test_a_program_with_no_native_rewrite_or_refusal_gets_no_such_labels():
    provider = SimpleNamespace(refusals={HookEventName.STOP: RefusalStyle.BLOCK}, rewrites={},
                               line_events=[HookEventName.PRE_TOOL_USE])
    hook = ManagedHook.found("sample", "PreToolUse", "Bash", {"command": "check"}, "settings.json", False)
    assert HookEffect.detected(hook, provider, HookEventName.PRE_TOOL_USE) == ["adds_lines"]


def test_overlap_uses_the_rule_event_and_declared_tool_categories():
    class ShellRule(DriverRule):
        name = "sample.shell"
        hook = HookEventName.PRE_TOOL_USE
        tools = [ToolType.SHELL]

    provider = SimpleNamespace(refusals={}, rewrites={}, line_events=[], tool_categories={"Bash": ToolType.SHELL})
    hook = ManagedHook.found("sample", "PreToolUse", "Bash", {"command": "check"}, "settings.json", False)
    assert HookEffect.detected(hook, provider, HookEventName.PRE_TOOL_USE, [ShellRule]) == [HookEffect.OVERLAPS]
    assert HookEffect.detected(hook, provider, HookEventName.POST_TOOL_USE, [ShellRule]) == []
