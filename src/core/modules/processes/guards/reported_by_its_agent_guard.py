from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process

ENDING_MOVES = (ProcessLifecycle.finish, ProcessLifecycle.fail)


class ReportedByItsAgentGuard(Guard):
    """Refuses the end of a process reported by an agent that did not run it."""

    name = "processes.reported-by-its-agent"
    event = "process.*"

    def check(self, change: Change[Model]) -> None:
        process = change.row
        if isinstance(process, Process) and change.move in ENDING_MOVES and change.actor.type is ActorType.AGENT and change.actor.id != process.agent_id:
            raise Refusal(f"process {process.id} is agent {process.agent_id}'s run, and agent {change.actor.id} cannot report its end", "only the agent that ran a line reports on it")
