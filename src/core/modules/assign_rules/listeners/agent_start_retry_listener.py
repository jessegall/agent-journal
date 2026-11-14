from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from engine.listener.commit.commit_listener import CommitListener
from core.modules.agents.models.agent import Agent
from core.modules.assign_rules.commands.record_assign_decision.judge_skipped_tasks import JudgeSkippedTasks


class AgentStartRetryListener(CommitListener[Created[Agent] | Updated[Agent]]):
    """When an agent starts, or an ended agent's row runs again, the tasks a rule of its environment was skipped
    for are judged again, since the agent may be the target that was missing."""

    name = "assign-rules.retry-on-agent-start"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[Agent] | Updated[Agent], logged: LoggedEvent) -> None:
        if isinstance(event, Updated) and not self.is_reopened(event):
            return
        self.bus.run(JudgeSkippedTasks(), Actor.core(), environment_id=event.row.environment_id, cause_id=logged.id)

    @staticmethod
    def is_reopened(event: Updated[Agent]) -> bool:
        return event.previous.ended_at is not None and event.row.ended_at is None
