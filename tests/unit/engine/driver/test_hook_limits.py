from engine.driver.hook_limits import AGENT_HOOK_LIMIT_SECONDS, HOOK_LIMIT_SECONDS, STOP_LIMIT_SECONDS, HookLimits
from engine.enums.hook_event_name import HookEventName


def test_a_main_agents_tool_hook_has_the_short_limit_and_its_stop_the_stop_limit():
    assert HookLimits.seconds(True, HookEventName.PRE_TOOL_USE) == HOOK_LIMIT_SECONDS
    assert HookLimits.seconds(True, HookEventName.STOP) == STOP_LIMIT_SECONDS


def test_another_agents_hooks_have_the_long_limit_also_at_a_stop():
    assert HookLimits.seconds(False, HookEventName.STOP) == AGENT_HOOK_LIMIT_SECONDS
