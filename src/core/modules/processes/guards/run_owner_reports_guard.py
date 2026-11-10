from engine.enums.actor_type import ActorType
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process
from engine.change.changed import Changed
from engine.command.context import Context

ENDING_MOVES = (ProcessLifecycle.finish, ProcessLifecycle.fail)


class RunOwnerReportsGuard(Guard[Changed[Process]]):
    """Refuses the end of a process reported by an agent that did not run it."""

    name = "processes.run-owner-reports"

    def check(self, event: Changed[Process], context: Context) -> None:
        process = event.row
        if event.move in ENDING_MOVES and context.actor.type is ActorType.AGENT and context.actor.id != process.session_agent_id:
            raise Refusal(f"process {process.id} is agent {process.session_agent_id}'s run, and agent {context.actor.id} cannot report its end", "only the agent that ran a line reports on it")
