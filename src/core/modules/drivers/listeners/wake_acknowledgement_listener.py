from engine.command.context import Context
from engine.enums.hook_event_name import HookEventName
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.models.hook_call import HookCall

ACTIVE_WAKES_REASON = "the active wake obligations of one agent, one for each work generation"
ACKNOWLEDGED_STATES = (WakeState.OPEN, WakeState.CLAIMED, WakeState.DELIVERED, WakeState.INHIBITED)


class WakeAcknowledgementListener(SaveListener[Changed[HookCall]]):
    """A hook of the agent is a turn, so it acknowledges each wake obligation of that agent written or tried
    before it, in the hook's own write (doc 1310 section 6.4); a typed line alone acknowledges nothing."""

    name = "drivers.wake-acknowledgement"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Changed[HookCall], context: Context) -> None:
        # a tick the server records as a hook call is no turn of the agent
        if event.old_row is not None or event.row.hook == HookEventName.TICK:
            return
        wakes = self.queries.query(AgentWake).filter(session_agent_id=event.row.session_agent_id).matching(
            Among("state", [state.value for state in ACKNOWLEDGED_STATES])).every_row(ACTIVE_WAKES_REASON)
        for wake in wakes:
            if wake.update_timestamp().value <= context.timestamp.value:
                self.repository.update(wake, context, state=WakeState.ACKNOWLEDGED, acknowledged_at=context.timestamp)
