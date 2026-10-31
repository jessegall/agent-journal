from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart


class PartReportedByItsAgentGuard(Guard):
    """Refuses the end of a part reported by an agent that did not run its process."""

    name = "processes.part-reported-by-its-agent"
    event = "process_part.*"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        part = change.row
        if not isinstance(part, ProcessPart) or change.old_row is None or change.actor.type is not ActorType.AGENT:
            return
        process = self.queries.query(Process).find(part.process_id)
        if change.actor.id != process.agent_id:
            raise Refusal(f"process {process.id} is agent {process.agent_id}'s run, and agent {change.actor.id} cannot report its parts", "only the agent that ran a line reports on it")
