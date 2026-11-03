import pytest

from core.base.driver.hook_event_name import HookEventName
from core.base.provider.hook_effect import HookEffect
from core.base.provider.managed_hook import ManagedHook
from core.modules.claude_code.providers.claude_code_provider import ClaudeCodeProvider


@pytest.mark.parametrize("native,event,matcher,expected", [
    ("PreToolUse", HookEventName.PRE_TOOL_USE, "Bash", [HookEffect.CAN_REFUSE, HookEffect.CAN_REWRITE, HookEffect.ADDS_LINES]),
    ("SessionStart", HookEventName.SESSION_START, "", [HookEffect.ADDS_LINES]),
    ("Stop", HookEventName.STOP, "", [HookEffect.CAN_REFUSE]),
])
def test_claude_hook_labels_follow_its_provider(native, event, matcher, expected):
    hook = ManagedHook.found(ClaudeCodeProvider.name, native, matcher, {"command": "check"}, "settings.json", False)
    assert HookEffect.detected(hook, ClaudeCodeProvider, event) == expected
