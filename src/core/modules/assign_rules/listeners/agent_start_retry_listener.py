from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.agents.models.agent import Agent
from core.modules.assign_rules.commands.record_assign_decision.retry_assign_decisions import RetryAssignDecisions


class AgentStartRetryListener(CommitListener[Created[Agent]]):
    """When an agent starts, the tasks a rule of its environment was skipped for are judged again, since the
    agent may be the target that was missing."""

    name = "assign-rules.retry-on-agent-start"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Agent], logged: LoggedEvent) -> None:
        self.bus.run(RetryAssignDecisions(), Actor.core(), environment_id=event.row.environment_id, cause_id=logged.id)
