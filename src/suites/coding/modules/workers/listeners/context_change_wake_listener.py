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
    """A typed /clear leaves the agent at its prompt with no turn running, so it is woken as soon as its new session is
    recorded; a compaction is left to the compaction wake rule, which waits ten seconds to see whether the agent is
    already working again."""

    name = "workers.context-change-wake"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if call.is_clear_start and self.agents.find(call.session_agent_id).role in CompactionWakeRule.roles:
            self.bus.run(WakeCompactedAgent(call.session_agent_id), Actor.core(), cause_id=logged.id, environment_id=call.environment_id)
