from engine.enums.actor_type import ActorType
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from engine.event.changed import Changed
from engine.command.context import Context


class RunOwnerPartsGuard(Guard[Changed[ProcessPart]]):
    """Refuses the end of a part reported by an agent that did not run its process."""

    name = "processes.run-owner-parts"

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Changed[ProcessPart], context: Context) -> None:
        part = event.row
        if event.old_row is None or context.actor.type is not ActorType.AGENT:
            return
        process = self.rows.required(Process, part.process_id)
        if context.actor.id != process.session_agent_id:
            raise Refusal(f"process {process.id} is another agent's run, so its parts are not yours to report", "only the agent that ran a line reports on it")
