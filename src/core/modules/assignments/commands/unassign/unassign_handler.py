from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.commands.unassign.unassign import Unassign
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.assignments import Assignments


class UnassignHandler(Handler[Unassign, tuple[Assignment, ...]]):
    """Removes the assignments of the named row and answers with the ones it removed. A person or the main
    agent runs it."""

    command = Unassign

    def __init__(self, rows: AssignableRows, assignments: Assignments, agents: AgentRows) -> None:
        self.rows, self.assignments, self.agents = rows, assignments, agents

    def handle(self, command: Unassign, context: Context) -> tuple[Assignment, ...]:
        self.agents.require_main(context.actor, "unassign a row")
        return self.assignments.unassign(self.rows.find(command.subject_model, command.subject_id), context, command.actor_id)
