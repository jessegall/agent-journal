from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.commands.unassign_row.unassign_row import UnassignRow
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.assignments import Assignments


class UnassignRowHandler(Handler[UnassignRow, tuple[Assignment, ...]]):
    """Removes the assignments of the named row and answers with the ones it removed. A user or the main
    agent runs it."""

    command = UnassignRow

    def __init__(self, rows: AssignableRows, assignments: Assignments, agents: AgentRows) -> None:
        self.rows, self.assignments, self.agents = rows, assignments, agents

    def handle(self, command: UnassignRow, context: Context) -> tuple[Assignment, ...]:
        self.agents.require_main(context.actor, "unassign a row")
        return self.assignments.unassign(self.rows.find(command.subject_model, command.subject_id), context, command.actor_id)
