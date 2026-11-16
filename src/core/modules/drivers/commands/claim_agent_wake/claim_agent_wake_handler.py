from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.agent_line import AgentLine

from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.count_down import CountDown
from engine.driver.message_sender import MessageSender
from engine.driver.time_window import TimeWindow
from engine.query.conditions.minimum import Minimum
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.enums.escalation_state import EscalationState
from core.modules.drivers.models.agent_escalation import AgentEscalation
from core.modules.drivers.commands.claim_agent_wake.claim_agent_wake import ClaimAgentWake
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.agent_messages.ignored_wake_message import IgnoredWakeMessage
from core.modules.drivers.agent_messages.wake_obligation_message import WakeObligationMessage
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.countdowns import Countdowns
from core.modules.drivers.support.driver_settings import WAKE_ATTEMPTS_SETTING

WAKE_SOURCE = "drivers.wake"
WAKE_ATTEMPTS_KEY = "drivers.wake_attempts"
WAKE_LEASE_SECONDS = 30
TYPING_TRANSPORT = "typing"
RESUME_TRANSPORT = "resume"


class ClaimAgentWakeHandler(Handler[ClaimAgentWake, AgentWake | None]):
    """The wake delivery owner's claim of a due obligation (doc 1310 section 6.4). It reads again first: a
    retired agent's wake is cancelled, a paused, interrupted or compacting agent's is inhibited until a step
    finds its cause again, one whose agent was typed a line since its last hook, within one lease, waits for the
    turn that line starts, and one tried as often as wake-attempts allows expires and its parent is told once.
    Otherwise it counts an attempt and claims the row with a lease, so a server that dies with it leaves the
    row to the boot's reclaim. The owner sends the wake after this write and records the delivery in a write
    of its own."""

    command = ClaimAgentWake

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, settings: SettingValues, hook_calls: HookCallQuery,
                 message_sender: MessageSender, countdowns: Countdowns) -> None:
        self.queries, self.repository, self.agents, self.settings = queries, repository, agents, settings
        self.hook_calls, self.message_sender, self.countdowns = hook_calls, message_sender, countdowns

    def handle(self, command: ClaimAgentWake, context: Context) -> AgentWake | None:
        wake = self.queries.query(AgentWake).find(command.wake_id)
        agent = self.agents.find(wake.session_agent_id)
        if agent.retired_at is not None:
            self.repository.update(wake, context, state=WakeState.CANCELLED, failure="the agent was retired")
            return None
        if self.is_inhibited(agent, context.timestamp):
            self.repository.update(wake, context, state=WakeState.INHIBITED)
            return None
        if self.has_recent_entered_line(agent, context.timestamp):
            return None
        attempts = self.attempts()
        if attempts.remaining_after(wake.attempts) == 0:
            self.ended(wake, agent, context)
            return None
        remaining = self.countdowns.tick(attempts, agent.id, str(wake.id), context)
        # the wake types the lines its step left waiting, such as a new message's; with none it says that work waits
        if not self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).exists():
            self.message_sender.send(agent.id, WakeObligationMessage.declared(), WAKE_SOURCE, context)
        return self.repository.update(wake, context, state=WakeState.CLAIMED, attempts=attempts.span.count - remaining, transport=self.transport(agent),
                                      lease_ends_at=context.timestamp.plus_seconds(WAKE_LEASE_SECONDS))

    # the agent's wake tries, counted silently for the wake it is on, up to wake-attempts
    def attempts(self) -> CountDown:
        return CountDown(WAKE_ATTEMPTS_KEY, "wake {subject}", TimeWindow(int(self.settings.number(WAKE_ATTEMPTS_SETTING))), is_silent=True)

    # paused, interrupted, compacting, or under an open escalation, which its responder's answer wakes from
    def is_inhibited(self, agent: Agent, timestamp: Timestamp) -> bool:
        if agent.paused_at is not None or agent.interrupted_at is not None or self.hook_calls.is_compacting(agent.id, timestamp):
            return True
        return self.queries.query(AgentEscalation).filter(session_agent_id=agent.id, state=EscalationState.OPEN).exists()

    def has_recent_entered_line(self, agent: Agent, timestamp: Timestamp) -> bool:
        lines = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.ENTERED).matching(
            Minimum("updated_at", timestamp.plus_seconds(-WAKE_LEASE_SECONDS).text))
        hook = self.hook_calls.newest_agent_hook(agent.id)
        return (lines if hook is None else lines.matching(Minimum("updated_at", hook.creation_timestamp().text))).exists()

    @staticmethod
    def transport(agent: Agent) -> str:
        return TYPING_TRANSPORT if agent.is_main else RESUME_TRANSPORT

    def ended(self, wake: AgentWake, agent: Agent, context: Context) -> None:
        self.repository.update(wake, context, state=WakeState.EXPIRED, failure=f"no turn after {wake.attempts} wakes")
        if agent.parent_id is not None:
            self.message_sender.send(agent.parent_id, IgnoredWakeMessage.declared(), WAKE_SOURCE, context, agent=agent.number, count=wake.attempts)
