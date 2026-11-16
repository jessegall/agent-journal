from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from core.modules.drivers.commands.claim_agent_line.claim_agent_line import ClaimAgentLine
from core.modules.drivers.commands.enter_agent_line.enter_agent_line import EnterAgentLine
from core.modules.drivers.commands.release_agent_line.release_agent_line import ReleaseAgentLine
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.line_typing import TERMINAL_PREFIX
from core.modules.drivers.support.wake_waiters import WakeWaiters

CONFIRM_SECONDS = 20


class WakeDelivery:
    """Gives a waiting line to its agent's wake waiter as typing would type it: only between turns and never
    while the agent compacts. The line is claimed first, so no hook gives it too, and entered once the waiter
    confirms it printed it; a line no waiter takes, or one not confirmed within 20 seconds, waits again."""

    def __init__(self, bus: Bus, hook_calls: HookCallQuery, home: JournalHome, clock: Clock) -> None:
        self.bus, self.hook_calls, self.waiters, self.clock = bus, hook_calls, WakeWaiters.shared(home), clock

    def has_waiter(self, agent_id: int) -> bool:
        return self.waiters.has_waiter(agent_id)

    def deliver(self, line: AgentLine, actor: Actor) -> bool:
        agent_id, now = line.session_agent_id, self.clock.timestamp()
        if not self.waiters.has_waiter(agent_id) or self.hook_calls.is_compacting(agent_id, now) or not self.hook_calls.has_ended_turn(agent_id):
            return False
        try:
            self.bus.run(ClaimAgentLine(line.id), actor)
        except Refusal:
            return False
        if not self.waiters.offer(agent_id, f"{TERMINAL_PREFIX}{line.agent_message.text}", line.id, now):
            self.bus.run(ReleaseAgentLine(line.id), actor)
            return False
        return True

    def confirm(self, line_id: int, token: str, actor: Actor) -> bool:
        if not self.waiters.confirmed(line_id, token):
            return False
        self.bus.run(EnterAgentLine(line_id), actor)
        return True

    def release_unconfirmed(self, actor: Actor) -> None:
        for line_id in self.waiters.unconfirmed(self.clock.timestamp().plus_seconds(-CONFIRM_SECONDS)):
            self.bus.run(ReleaseAgentLine(line_id), actor)
