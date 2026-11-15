from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.wake_cause import WakeCause
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.queries.hook_call_query import HookCallQuery


class TurnFailedWake(WakeCause):
    """The agent's last turn ended on a program error, once for each failure (doc 1310 section 6.4)."""

    key = "drivers.turn-failed"

    def __init__(self, hook_calls: HookCallQuery) -> None:
        self.hook_calls = hook_calls

    def needs_wake(self, view: AgentView) -> bool:
        hook = self.hook_calls.newest_agent_hook(view.agent.agent_id)
        return hook is not None and HookEventName(hook.hook) is HookEventName.STOP_FAILURE

    def text(self, view: AgentView) -> str:
        return "Your last turn failed on a program error: go on"
