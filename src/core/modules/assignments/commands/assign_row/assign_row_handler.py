from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.assignments.commands.assign_row.assign_row import AssignRow
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignable_rows import AssignableRows
from core.modules.assignments.support.assignments import Assignments


class AssignRowHandler(Handler[AssignRow, tuple[Assignment, ...]]):
    """Gives the named row to the actor and answers with the assignments the row has afterwards. A person or
    the main agent runs it."""

    command = AssignRow

    def __init__(self, rows: AssignableRows, assignments: Assignments, agents: AgentRows) -> None:
        self.rows, self.assignments, self.agents = rows, assignments, agents

    def handle(self, command: AssignRow, context: Context) -> tuple[Assignment, ...]:
        self.agents.require_main(context.actor, "assign a row")
        row = self.rows.find(command.subject_model, command.subject_id)
        self.assignments.assign(row, command.actor_id, context, cascade=command.cascade, override=command.override)
        return self.assignments.assignments(row)
