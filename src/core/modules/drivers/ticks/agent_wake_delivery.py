from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.log.error_log import ErrorLog
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.time.clock import Clock
from core.modules.drivers.commands.deliver_agent_wake.deliver_agent_wake import DeliverAgentWake
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState

DUE_WAKES_REASON = "the wake obligations that may be due, one active row for each agent and work generation"
MOVING_STATES = (WakeState.OPEN, WakeState.CLAIMED, WakeState.DELIVERED)


class AgentWakeDelivery:
    """The wake delivery owner's round, every few seconds and at boot (doc 1310 section 6.4): each open
    obligation, each delivered one past its retry time and each claim whose lease ran out (a dead server's,
    at boot) takes its next move in a write of its own; one that fails is logged and the others go on."""

    def __call__(self, container: Container) -> None:
        timestamp = container.get(Clock).timestamp()
        wakes = container.get(Queries).query(AgentWake).every_environment(DUE_WAKES_REASON).matching(Among("state", [state.value for state in MOVING_STATES])).every_row(DUE_WAKES_REASON)
        for wake in wakes:
            if not self.needs_move(wake, timestamp):
                continue
            try:
                container.get(Bus).run(DeliverAgentWake(wake.id), Actor.core(), environment_id=wake.environment_id)
            # one wake that fails is logged and waits for the next round, and never keeps the others from theirs
            except Exception as error:
                container.get(ErrorLog).reported(["agent wake delivery", str(wake.id)], error, wake.environment_id)

    @staticmethod
    def needs_move(wake: AgentWake, timestamp) -> bool:
        if wake.state is WakeState.OPEN:
            return True
        if wake.state is WakeState.CLAIMED:
            return wake.lease_ends_at is None or wake.lease_ends_at.value <= timestamp.value
        return wake.next_attempt_at is None or wake.next_attempt_at.value <= timestamp.value
