from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.agents.models.agent import Agent
from core.modules.schedules.commands.end_scheduled_job.end_scheduled_job import EndScheduledJob
from core.base.change.updated import Updated
from core.base.command.context import Context


class EndedAgentJobsListener(SaveListener[Updated[Agent]]):
    """An agent's end ends every job it scheduled, since its program holds them only while it runs."""

    name = "schedules.ended-agent-jobs"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Updated[Agent], context: Context) -> None:
        if isinstance(event.row, Agent) and event.row.ended_at is not None:
            command = EndScheduledJob(event.row.id, None)
            self.bus.dispatch(command, context.nested(command))
