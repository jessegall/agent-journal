from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.timestamp import Timestamp
from core.modules.agents.commands.record_agent_interrupt.record_agent_interrupt import RecordAgentInterrupt
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_link import LauncherLink
from core.modules.drivers.commands.wake_interrupted_agent.wake_interrupted_agent import WakeInterruptedAgent
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery

IDLE_SECONDS = 30


class InterruptedAgents:
    """Wakes a main agent whose turn was interrupted once nobody has typed in its terminal for 30 seconds,
    with one line that it was interrupted and goes on with its work; a person typing in that time, or a
    stop the agent made on its own, ends the wait with no wake."""

    def __init__(self, bus: Bus, launcher: LauncherLink, hook_calls: HookCallQuery) -> None:
        self.bus, self.launcher, self.hook_calls = bus, launcher, hook_calls

    def watch(self, agent: Agent, timestamp: Timestamp) -> None:
        interrupted_at = agent.interrupted_at
        if interrupted_at is None:
            return
        if self.stopped_normally(agent, interrupted_at):
            return self.clear_pending(agent)
        waited = interrupted_at.elapsed_seconds(timestamp)
        if waited < IDLE_SECONDS:
            return
        idle = self.launcher.idle_seconds(agent.terminal_id)
        if idle is None:
            return
        self.clear_pending(agent)
        if idle >= waited:
            self.bus.run(WakeInterruptedAgent(agent.id), Actor.core(), environment_id=agent.environment_id)

    def stopped_normally(self, agent: Agent, interrupted_at: Timestamp) -> bool:
        stop = self.hook_calls.agent(agent.id).filter(hook=HookEventName.STOP).newest().first()
        return stop is not None and stop.answer is HookAnswer.ALLOWED and stop.creation_timestamp().value > interrupted_at.value

    def clear_pending(self, agent: Agent) -> None:
        self.bus.run(RecordAgentInterrupt(agent.id, False), Actor.core(), environment_id=agent.environment_id)
