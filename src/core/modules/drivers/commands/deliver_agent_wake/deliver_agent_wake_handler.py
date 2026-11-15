import json

from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.count_down import CountDown
from engine.driver.nudger import Nudger
from engine.driver.times_span import TimesSpan
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.deliver_agent_wake.deliver_agent_wake import DeliverAgentWake
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.nudges.ignored_wake_nudge import IgnoredWakeNudge
from core.modules.drivers.nudges.wake_obligation_nudge import WakeObligationNudge
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.countdowns import Countdowns
from core.modules.drivers.support.driver_settings import WAKE_ATTEMPTS_SETTING, WAKE_RETRY_SETTING
from core.modules.drivers.support.waiting_line_typing import WaitingLineTyping

WAKE_SOURCE = "drivers.wake"
WAKE_ATTEMPTS_KEY = "drivers.wake_attempts"


class DeliverAgentWakeHandler(Handler[DeliverAgentWake, None]):
    """The wake delivery owner's one move on a due obligation (doc 1310 section 6.4). It reads again first: a
    retired agent's wake is cancelled, a paused, interrupted or compacting agent's is inhibited until a step
    finds its cause again, and one tried as often as wake-attempts allows expires and its parent is told
    once. Otherwise it counts an attempt and gives the wake line: typed now to a main agent between turns,
    and left waiting for a headless agent, whose resumer starts it within the suite's resume limits. The row
    is delivered until a hook of the agent acknowledges it or wake-retry-seconds pass."""

    command = DeliverAgentWake

    def __init__(self, queries: Queries, repository: Repository, agents: AgentRows, settings: SettingValues, hook_calls: HookCallQuery,
                 nudger: Nudger, typing: WaitingLineTyping, countdowns: Countdowns) -> None:
        self.queries, self.repository, self.agents, self.settings = queries, repository, agents, settings
        self.hook_calls, self.nudger, self.typing, self.countdowns = hook_calls, nudger, typing, countdowns

    def handle(self, command: DeliverAgentWake, context: Context) -> None:
        wake = self.queries.query(AgentWake).find(command.wake_id)
        agent = self.agents.find(wake.session_agent_id)
        if agent.retired_at is not None:
            self.repository.save(wake.changed(state=WakeState.CANCELLED, failure="the agent was retired"), context)
            return
        if self.is_inhibited(agent, context.timestamp):
            self.repository.save(wake.changed(state=WakeState.INHIBITED), context)
            return
        attempts = self.attempts()
        if attempts.remaining_after(wake.attempts) == 0:
            self.ended(wake, agent, context)
            return
        remaining = self.countdowns.tick(attempts, agent.id, str(wake.id), context)
        retry = Timestamp(context.timestamp.value).plus_seconds(self.settings.number(WAKE_RETRY_SETTING))
        self.repository.save(wake.changed(state=WakeState.DELIVERED, attempts=attempts.span.count - remaining, next_attempt_at=retry, transport=self.transport(agent)), context)
        self.nudger.send(agent.id, WakeObligationNudge.declared(), WAKE_SOURCE, context)
        if agent.is_main:
            self.typing.release(agent.id, context.actor.id, context.timestamp)

    # the agent's wake tries, counted silently for the wake it is on, up to wake-attempts
    def attempts(self) -> CountDown:
        return CountDown(WAKE_ATTEMPTS_KEY, "wake {subject}", TimesSpan(int(self.settings.number(WAKE_ATTEMPTS_SETTING))), is_silent=True)

    def is_inhibited(self, agent: Agent, timestamp: Timestamp) -> bool:
        return agent.paused_at is not None or agent.interrupted_at is not None or self.hook_calls.is_compacting(agent.id, timestamp)

    @staticmethod
    def transport(agent: Agent) -> str:
        return "typing" if agent.is_main else "resume"

    def ended(self, wake: AgentWake, agent: Agent, context: Context) -> None:
        self.repository.save(wake.changed(state=WakeState.EXPIRED, failure=f"no turn after {wake.attempts} wakes"), context)
        if agent.parent_id is not None:
            self.nudger.send(agent.parent_id, IgnoredWakeNudge.declared(), WAKE_SOURCE, context, agent=agent.number, attempts=wake.attempts,
                             causes=", ".join(json.loads(wake.causes)))
