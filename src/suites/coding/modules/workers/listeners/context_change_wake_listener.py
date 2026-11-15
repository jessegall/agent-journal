from engine.agent_machine.contracts.slice_answers import WAITING_SLICE, SliceAnswers
from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.events.session_started import SessionStarted
from suites.coding.modules.workers.rules.compaction_wake_rule import CompactionWakeRule


class ContextChangeWakeListener(CommitListener[SessionStarted]):
    """A typed /clear leaves the agent at its prompt with no turn running, so it is woken as soon as its
    new session is recorded; a compaction is left to the compaction wake rule, which waits ten seconds to
    see whether the agent is already working again."""

    name = "workers.context-change-wake"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, bus: Bus, slices: SliceAnswers) -> None:
        self.agents, self.bus, self.slices = agents, bus, slices

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if call.is_clear_start and self.wakes_after_clear(call.session_agent_id):
            self.bus.run(WakeCompactedAgent(call.session_agent_id), Actor.core(), cause_id=logged.id, environment_id=call.environment_id)

    # a role the compaction wake covers, unless the waiting slice wakes it through the one wake owner
    def wakes_after_clear(self, agent_id: int) -> bool:
        return self.agents.find(agent_id).role in CompactionWakeRule.roles and not self.slices.answers(agent_id, WAITING_SLICE)
