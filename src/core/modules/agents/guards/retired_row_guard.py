from core.base.change.updated import Updated
from core.base.command.context import Context
from core.base.command.edit_command import EditCommand
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent


class RetiredRowGuard(Guard[Updated[Agent]]):
    """Retirement is permanent and only the retire command sets it: an edit does not touch its fields, and nothing
    clears them or reopens a retired agent."""

    name = "agents.retired-row"
    is_safety = True

    def check(self, event: Updated[Agent], context: Context) -> None:
        old_row, row = event.old_row, event.row
        if old_row is None:
            return
        retirement = (old_row.retired_at, old_row.retirement_reason, old_row.retiring_actor_id)
        if isinstance(context.command, EditCommand) and retirement != (row.retired_at, row.retirement_reason, row.retiring_actor_id):
            raise Refusal("an edit does not change a retirement", f'journal agent retire {row.id} --reason "<why>"')
        if old_row.retired_at is not None and (row.retired_at is None or row.ended_at is None):
            raise Refusal(f"agent {row.id} is retired, for good", "start a new agent")
