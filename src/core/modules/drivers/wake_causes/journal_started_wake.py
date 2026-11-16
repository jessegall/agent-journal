from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.wake_cause import WakeCause
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.agent_messages.journal_started_message import JournalStartedMessage
from core.modules.drivers.queries.hook_call_query import HookCallQuery

# the hooks after which an agent is between turns, so a journal start cut nothing short
TURN_ENDS = (HookEventName.STOP, HookEventName.STOP_FAILURE, HookEventName.SESSION_END)


class JournalStartedWake(WakeCause):
    """The journal started while the agent was in a turn, so the server stop cut that turn short (doc 1310
    section 6.4)."""

    key = "drivers.journal-started"
    wakes_mid_turn = True

    def __init__(self, hook_calls: HookCallQuery) -> None:
        self.hook_calls = hook_calls

    def requires_wake(self, view: AgentView) -> bool:
        hook = self.hook_calls.newest_agent_hook(view.agent.agent_id)
        if hook is None or view.journal_started_at is None or HookEventName(hook.hook) in TURN_ENDS:
            return False
        return view.journal_started_at > hook.creation_timestamp().value

    def text(self, view: AgentView) -> str:
        return JournalStartedMessage.declared().agent_message().text
