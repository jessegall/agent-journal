from core.base.actor_type import ActorType
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.base.change.changed import Changed
from core.base.command.context import Context


class RunOwnerPartsGuard(Guard[Changed[ProcessPart]]):
    """Refuses the end of a part reported by an agent that did not run its process."""

    name = "processes.run-owner-parts"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Changed[ProcessPart], context: Context) -> None:
        part = event.row
        if event.old_row is None or context.actor.type is not ActorType.AGENT:
            return
        process = self.queries.query(Process).find(part.process_id)
        if context.actor.id != process.session_agent_id:
            raise Refusal(f"process {process.id} is agent {process.session_agent_id}'s run, and agent {context.actor.id} cannot report its parts", "only the agent that ran a line reports on it")
