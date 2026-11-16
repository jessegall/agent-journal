from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.log.error_log import ErrorLog
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.time.clock import Clock
from core.modules.drivers.commands.claim_agent_wake.claim_agent_wake import ClaimAgentWake
from core.modules.drivers.commands.claim_agent_wake.claim_agent_wake_handler import TYPING_TRANSPORT
from core.modules.drivers.commands.record_wake_delivery.record_wake_delivery import RecordWakeDelivery
from core.modules.drivers.commands.reopen_agent_wake.reopen_agent_wake import ReopenAgentWake
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState

DUE_WAKES_REASON = "the wake obligations that may be due, one active row for each agent and work generation"
MOVING_STATES = (WakeState.OPEN, WakeState.CLAIMED, WakeState.DELIVERED)
UNTYPED_WAKE_FAILURE = "no line reached the terminal: its prompt was not open, or the launcher refused it"


class AgentWakeDelivery:
    """The wake delivery owner's round, every few seconds and at boot (doc 1310 section 6.4): each open
    obligation, each delivered one past its retry time and each claim whose lease ran out (a dead server's,
    at boot) is claimed in a write of its own, sent after it (a main agent's lines typed into its terminal, a
    headless agent's left waiting for its resume) and recorded as delivered, or put back to open when sending
    failed; one that fails is logged and the others go on."""

    def __call__(self, container: Container) -> None:
        timestamp = container.get(Clock).timestamp()
        wakes = container.get(Queries).query(AgentWake).all_environments(DUE_WAKES_REASON).matching(Among("state", [state.value for state in MOVING_STATES])).every_row(DUE_WAKES_REASON)
        for wake in wakes:
            if not self.requires_move(wake, timestamp):
                continue
            try:
                self.moved(container, wake)
            # one wake that fails is logged and waits for the next round, and never keeps the others from theirs
            except Exception as error:
                container.get(ErrorLog).reported(["agent wake delivery", str(wake.id)], error, wake.environment_id)

    # the claim's write, the transport after it, and the delivery's write: a typed line is never sent inside a write
    @staticmethod
    def moved(container: Container, wake: AgentWake) -> None:
        bus = container.get(Bus)
        claimed = bus.run(ClaimAgentWake(wake.id), Actor.core(), environment_id=wake.environment_id)
        if claimed is None:
            return
        try:
            is_line_entered = claimed.transport != TYPING_TRANSPORT or container.get(WaitingLineTyping).release_waiting_lines(claimed.session_agent_id, Actor.core().id)
        except Exception as error:
            bus.run(ReopenAgentWake(claimed.id, str(error)), Actor.core(), environment_id=claimed.environment_id)
            raise
        if not is_line_entered:
            bus.run(ReopenAgentWake(claimed.id, UNTYPED_WAKE_FAILURE), Actor.core(), environment_id=claimed.environment_id)
            return
        bus.run(RecordWakeDelivery(claimed.id), Actor.core(), environment_id=claimed.environment_id)

    @staticmethod
    def requires_move(wake: AgentWake, timestamp) -> bool:
        if wake.state is WakeState.OPEN:
            return True
        if wake.state is WakeState.CLAIMED:
            return wake.lease_ends_at is None or wake.lease_ends_at.value <= timestamp.value
        return wake.next_attempt_at is None or wake.next_attempt_at.value <= timestamp.value
