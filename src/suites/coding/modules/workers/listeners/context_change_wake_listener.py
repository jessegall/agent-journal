from engine.actor.actor import Actor
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.wake_compacted_agent.wake_compacted_agent import WakeCompactedAgent
from core.modules.drivers.events.session_started import SessionStarted
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from suites.coding.modules.workers.rules.compaction_wake_rule import CompactionWakeRule


class ContextChangeWakeListener(CommitListener[SessionStarted]):
    """A typed /clear or /compact leaves the agent at its prompt with no turn running, so it is woken as soon as its
    new session is recorded; an automatic compaction goes on with its turn by itself."""

    name = "workers.context-change-wake"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, hook_calls: HookCallQuery, bus: Bus) -> None:
        self.agents, self.hook_calls, self.bus = agents, hook_calls, bus

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if self.is_typed_change(call) and self.agents.find(call.session_agent_id).role in CompactionWakeRule.roles:
            self.bus.run(WakeCompactedAgent(call.session_agent_id), Actor.core(), cause_id=logged.id, environment_id=call.environment_id)

    def is_typed_change(self, call: HookCall) -> bool:
        if call.is_clear_start:
            return True
        compaction = self.hook_calls.latest_compaction(call.session_agent_id)
        return call.is_compaction_start and compaction is not None and compaction.is_manual_compaction
