from engine.command.bus import Bus
from engine.driver.line_delivery import LineDelivery
from engine.driver.program_lockdown import ProgramLockdown
from engine.driver.wake_ask import WakeAsk
from engine.driver.wake_reply import WakeReply
from engine.driver.wake_route import WakeRoute
from engine.journal.journal_home import JournalHome
from engine.module.module_actors import ModuleActors
from engine.provider.providers import Providers
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.record_agent_nudge.record_agent_nudge import RecordAgentNudge
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.drivers.models.enums.wake_outcome import WakeOutcome
from core.modules.drivers.support.driver_nudges import PROJECT_HOOK_WOKE
from core.modules.drivers.support.driver_settings import MODULE_KEY
from core.modules.drivers.support.wake_delivery import WakeDelivery
from core.modules.drivers.support.wake_waiters import WakeWaiters

PROJECT_HOOK_SOURCE = "drivers.project-hook"
PROJECT_HOOK_TEXT_CHARACTERS = 800
WAKING_LINES_REASON = "a wake ask offers every line that waits to wake its agent, oldest first"


class AgentWakeRoute(WakeRoute):
    """Answers an agent program's wake hook. An agent that is not open, not a main agent or a launched helper, whose
    program has no wake hook or is locked down, or whose session is not the one asking, is gone. Otherwise its waiter is
    registered, cancelling an older one, and given at once a line that already waits to wake it; else it waits."""

    def __init__(self, agents: AgentRows, providers: Providers, lockdown: ProgramLockdown, delivery: WakeDelivery, queries: Queries, home: JournalHome,
                 actors: ModuleActors, bus: Bus) -> None:
        self.agents, self.providers, self.lockdown, self.delivery, self.queries, self.bus = agents, providers, lockdown, delivery, queries, bus
        self.waiters, self.actors = WakeWaiters.shared(home), actors

    def answer(self, ask: WakeAsk) -> WakeReply:
        agent = self.asking_agent(ask)
        if agent is None or not self.may_wait(agent, ask):
            return WakeReply.gone()
        waiter = self.waiters.register(agent.id, ask.token)
        self.delivery.release_unconfirmed(self.actors.actor(MODULE_KEY))
        waiting = self.queries.query(AgentLine).filter(session_agent_id=agent.id, state=AgentLineState.WAITING).every_row(WAKING_LINES_REASON)
        for line in waiting:
            if line.delivery is LineDelivery.WAKE_HOOK and self.delivery.deliver(line, self.actors.actor(MODULE_KEY)):
                break
        if waiter.outcome is WakeOutcome.GIVEN:
            return self.taken(agent.id, ask.token)
        return WakeReply.waiting(agent.id, ask.token)

    def waited(self, waiting: WakeReply, seconds: float) -> WakeReply:
        waiter = self.waiters.waiter(waiting.agent_id, waiting.token)
        if waiter is None:
            return WakeReply.gone()
        outcome = self.waiters.wait(waiter, seconds).outcome
        if outcome is WakeOutcome.GIVEN:
            return WakeReply.given(waiter.text, waiter.line_id, waiter.token)
        return WakeReply.nothing() if outcome is WakeOutcome.NOTHING else WakeReply.gone()

    def received(self, line_id: int, token: str) -> bool:
        return self.delivery.confirm(line_id, token, self.actors.actor(MODULE_KEY))

    # a project hook that ran in the background and ended with exit code 2 leaves its text as a line that wakes its agent
    def line(self, ask: WakeAsk, hook: str, text: str) -> bool:
        agent = self.asking_agent(ask)
        if agent is None or not (agent.is_main or agent.is_launched_helper):
            return False
        nudge = PROJECT_HOOK_WOKE.nudge(hook=hook, text=text[:PROJECT_HOOK_TEXT_CHARACTERS])
        self.bus.run(RecordAgentNudge(agent.id, nudge, PROJECT_HOOK_SOURCE), self.actors.actor(MODULE_KEY), environment_id=agent.environment_id)
        return True

    def asking_agent(self, ask: WakeAsk) -> Agent | None:
        return self.agents.open_session(ask.session) or (self.agents.open_launch(ask.launch) if ask.launch else None)

    def live_waiters(self) -> int:
        return self.waiters.live_count()

    def may_wait(self, agent: Agent, ask: WakeAsk) -> bool:
        provider = self.providers.provider(agent.program)
        return (agent.is_main or agent.is_launched_helper) and provider.wake_hook is not None and agent.session == ask.session \
            and not self.lockdown.lockdown(agent.program).is_active

    def taken(self, agent_id: int, token: str) -> WakeReply:
        return self.waited(WakeReply.waiting(agent_id, token), 0)
