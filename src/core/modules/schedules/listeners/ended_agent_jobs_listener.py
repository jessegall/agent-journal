from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.agents.models.agent import Agent
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob


class EndedAgentJobsListener(SaveListener):
    """An agent's end ends every job it scheduled, since its program holds them only while it runs."""

    name = "schedules.ended-agent-jobs"
    event = "agent.update"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        if isinstance(change.row, Agent) and change.row.ended_at is not None:
            command = EndScheduledJob(change.row.id, None)
            self.bus.dispatch(command, change.context.nested(command))
