from dataclasses import replace

from core.base.change.event_type import EventType
from core.base.driver.hook_event_name import HookEventName
from core.modules.drivers.events.agent_compacted import AgentCompacted
from core.modules.drivers.events.prompt_submitted import PromptSubmitted
from core.modules.drivers.events.session_started import SessionStarted
from core.modules.drivers.events.stop_allowed import StopAllowed
from core.modules.drivers.events.stop_denied import StopDenied
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall


def test_each_hook_event_has_its_name():
    assert EventType.parsed(AgentCompacted).pattern(()) == "hook_call.compact"
    assert EventType.parsed(SessionStarted).pattern(()) == "hook_call.session_start"
    assert EventType.parsed(StopAllowed).pattern(()) == "hook_call.stop_allowed"
    assert EventType.parsed(StopDenied).pattern(()) == "hook_call.stop_refused"
    assert EventType.parsed(PromptSubmitted).pattern(()) == "hook_call.prompt"


def test_a_new_hook_call_names_its_change_and_a_second_save_does_not():
    call = HookCall(session_agent_id=1, environment_id=1, creator_id=1, hook=HookEventName.STOP, firing="f", answer=HookAnswer.REFUSED)
    assert call.change_name(None) == "stop_refused"
    assert replace(call, answer=HookAnswer.ALLOWED).change_name(None) == "stop_allowed"
    assert replace(call, hook=HookEventName.COMPACT).change_name(None) == "compact"
    assert replace(call, hook=HookEventName.SESSION_START).change_name(None) == "session_start"
    assert replace(call, hook=HookEventName.PROMPT).change_name(None) == "prompt"
    assert replace(call, hook=HookEventName.PRE_TOOL_USE).change_name(None) is None
    assert call.change_name(call) is None
