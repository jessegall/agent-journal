from core.base.change.event_type import EventType
from core.modules.drivers.events.agent_compacted import AgentCompacted
from core.modules.drivers.events.prompt_submitted import PromptSubmitted
from core.modules.drivers.events.session_started import SessionStarted
from core.modules.drivers.events.stop_allowed import StopAllowed
from core.modules.drivers.events.stop_refused import StopRefused


def test_each_hook_event_has_its_name():
    assert EventType.parsed(AgentCompacted).pattern(()) == "hook_call.compact"
    assert EventType.parsed(SessionStarted).pattern(()) == "hook_call.session_start"
    assert EventType.parsed(StopAllowed).pattern(()) == "hook_call.stop_allowed"
    assert EventType.parsed(StopRefused).pattern(()) == "hook_call.stop_refused"
    assert EventType.parsed(PromptSubmitted).pattern(()) == "hook_call.prompt"
